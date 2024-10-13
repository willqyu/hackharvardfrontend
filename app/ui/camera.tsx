import React, { useState, useRef } from 'react';
import { Camera, RotateCw  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from './spinner';
import SubmitReport from './submit_report';
import { backendAPI } from "@/lib/config";
import { reportPayload } from './submit_report';
import Letter from './letter';
import Typewriter from 'typewriter-effect';

export default function CameraImageCapture() {
  const [capturedImage, setCapturedImage] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [camStarted, setCamStarted] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [comment, setComment] = useState('');
  const [reportType, setReportType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [timestamp, setTimestamp] = useState<number>(0);
  const [letterContents, setLetter] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [showLetter, setShowLetter] = useState(false); // Track letter visibility
  const letterRef = useRef<HTMLDivElement>(null); // Ref to scroll to the letter
  const [title, setTitle] = useState(''); // Title for Letter component


  const startCamera = async () => {
    try {
        setIsCapturing(false);
        setCamStarted(true);
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
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageDataUrl = canvas.toDataURL('image/jpeg');
          setCapturedImage(imageDataUrl);
          stopCamera();
          handleGeoLocation(); 
          return imageDataUrl;
        }
    }
    return null;
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
      console.log(data);
      setComment(data.message);
      setReportType(data.feature);
    } catch (error) {
      console.error('Error sending image to endpoint:', error);
      setComment('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLetter = async () => {
    const payload: reportPayload = {
        type: reportType,
        image: capturedImage,
        comment: comment,
        timestamp: timestamp,
        latitude: latitude,
        longitude: longitude,
    }
    const response = await fetch(backendAPI + '/api/get-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to generate letter');
      }
      const data = await response.json();
      setLetter(data.message);
      setShowLetter(true);
      setTimeout(() => letterRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

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

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser");
        return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const timestamp = position.timestamp;
        const address = await getAddressFromCoords(latitude, longitude);
        setLatitude(latitude);
        setLongitude(longitude);
        setTimestamp(timestamp);
        setAddress(address);
        // sendLocationToBackend(latitude, longitude);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching geolocation:", error);
        setIsLoading(false);
    });
  };

  // function sendLocationToBackend(lat, lon) {
  //     // existing send location to backend code
  // };

  async function getAddressFromCoords(lat: number, lon: number) {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      try {
          const response = await fetch(url);
          const data = await response.json();
          return data.display_name;
      } catch (error) {
          console.error("Error fetching address:", error);
          return "Unable to retrieve address";
      }
  };


  return (
    <div className="min-h-screen h-screen w-screen overflow-y-auto bg-transparent">
      <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-3xl p-4 mx-auto">
        <h1 className={`${camStarted ? 'text-xl' : 'text-7xl h-72'} md:text-5xl mt-52 font-bold text-white `}>
          <Typewriter 
            options={{
              strings: ['Be the change.', 'Make a difference.', 'Inspire action.'],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>
        {!camStarted && (
          <button
            className="px-6 py-2 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-900 rounded-2xl shadow-lg shadow-slate-600 hover:shadow-xl transition-shadow duration-300 hover:bg-white focus:outline-none"
            onClick={startCamera}
          >
            Start Camera
          </button>
        )}

      {camStarted &&  (
        <div className={`transition-all duration-700 ease-in-out transform ${
          isCapturing ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        } flex justify-between space-x-8 mt-4`}
      >
        <Button
          className=" border-slate-200 border-2 text-white bg-transparent px-6 py-2 rounded-2xl shadow- hover:bg-slate-200 hover:text-white transition-all duration-300 shadow-slate-700"
          onClick={() => {
            setCapturedImage('');
            setComment('');
            setAddress('');
            startCamera();
          }}
        >
          Retake Photo
        </Button>
  
        <SubmitReport
          type={reportType}
          image={capturedImage}
          comment={comment}
          timestamp={timestamp ?? 0}
          latitude={latitude ?? 0}
          longitude={longitude ?? 0}
        />
      </div>
      )}
    
        {!capturedImage ? (
          <div className="relative rounded-lg">
            <div
              className={`transition-all duration-700 ease-in-out transform ${
                isCapturing ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              } rounded-lg h-full w-full max-w-lg mt-`}
            >
            <div className="aspect-[9/16]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            </div>
            {isCapturing && (  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <Button
                  onClick={async () => {
                    const image = captureImage();
                    if (image) await sendImageToEndpoint(image);
                  }}
                  disabled={isLoading}
                >
                  <Camera className="mr-2 h-4 w-4 bg-gradient-to-r from-slate-800 to-slate-95 opacity-45" /> Capture
                </Button>
              </div>)}
          </div>
        ) : (
          <div className="space-y-4 ">
            <div className="inset-x-0 bottom-0 aspect-[9/16] w-7/8 rounded-2xl bg-gradient-to-br from-slate-950 to-black shadow-slate-800 backdrop-blur shadow-sm">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover rounded-2xl p-2"
              />
              {capturedImage && address && 
                <p className="px-6 text-center text-white py-5">
                  Address: {address}
                </p>
}
            </div>
            {isLoading ? (
              <LoadingSpinner />
            ) : <></>}
            <textarea
              className="h-[100px] w-full p-4 shadow-inner border rounded-2xl focus:outline-none text-md bg-slate-500/10 text-white placeholder-white"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isLoading}
            />

          </div>
        )}


        {showLetter && (
          <div ref={letterRef}>
            <Letter recipient="John Doe" initialTitle={title} initialBody={comment} />
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>

  );
  
}