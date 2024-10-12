import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function CameraImageCapture() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
    }
  };

  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      stopCamera();

      // Send image to endpoint and get response
      await sendImageToEndpoint(imageDataUrl);
    }
  };

  const sendImageToEndpoint = async (imageDataUrl: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/describe-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_data: imageDataUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setComment(data.message);
    } catch (error) {
      console.error('Error sending image to endpoint:', error);
      setComment('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject && 'getTracks' in video.srcObject) {
      const stream = video.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Camera Image Capture</CardTitle>
      </CardHeader>
      <CardContent>
        {!capturedImage ? (
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <Button 
              onClick={captureImage} 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              disabled={isLoading}
            >
              <Camera className="mr-2 h-4 w-4" /> Capture
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
            <Input
              type="text"
              placeholder={isLoading ? "Analyzing image..." : "Add a comment..."}
              value={comment}
              onChange={handleCommentChange}
              disabled={isLoading}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!capturedImage ? (
          <Button onClick={startCamera}>Start Camera</Button>
        ) : (
          <Button onClick={() => {
            setCapturedImage(null);
            setComment('');
          }}>
            Retake Photo
          </Button>
        )}
      </CardFooter>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Card>
  );
}