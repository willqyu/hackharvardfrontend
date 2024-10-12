import React, { useState, useRef } from 'react';
import { Camera, RotateCw  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from './spinner';
import SubmitReport from './submit_report';
import { backendAPI } from "@/lib/config";

export default function CameraImageCapture() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
        setIsCapturing(false);
        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          tracks.forEach(track => track.stop());
        }
  
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCapturing(true);
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
  };

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
    startCamera();
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && isCapturing) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        stopCamera();
        
        return imageDataUrl
    }
  };

  const sendImageToEndpoint = async (imageDataUrl: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(backendAPI + '/api/describe-image', {
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
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
      setIsCapturing(false);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Camera Image Capture</CardTitle>
      </CardHeader>
      <CardContent>
        {!capturedImage ? (
          <div className="relative bg-gray-100 rounded-lg overflow-hidden h-[600px]">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-fit" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button onClick={ async () => {
                        // Send image to endpoint and get response
                        const image = captureImage();
                        if (image){
                            await sendImageToEndpoint(image)
                        }
                    }
                } disabled={isLoading}>
                <Camera className="mr-2 h-4 w-4" /> Capture
              </Button>
              <Button onClick={toggleCamera} variant="outline">
                <RotateCw className="h-4 w-4"/>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <p>Add a comment to describe the issue, or use the AI-generated comment. </p>
            )}
            <div className=' border-gray-300 border-2 box-border p-2 rounded-lg overflow-hidden'>
                <textarea
                    className='h-[200px] w-full focus:outline-none text-sm'
                    placeholder={isLoading ? "Analyzing image..." : "Add a comment..."}
                    value={comment}
                    onChange={handleCommentChange}
                    disabled={isLoading}
                />
            </div>
            
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!capturedImage ? (
          <Button onClick={startCamera}>Start Camera</Button>
        ) : (
            <div className='flex justify-between w-full'>
                <Button onClick={() => {
                    setCapturedImage(null);
                    setComment('');
                    startCamera()
                }}>
                    Retake Photo
                </Button>
                <SubmitReport/>
            </div>
        )}
      </CardFooter>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Card>
  );
}