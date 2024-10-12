"use client";

import React, { useState, useEffect } from "react";
import CameraImageCapture from "./ui/camera";
import Letter from "./ui/letter";

export default function Home() {
  const [reportSubmitted, setReportSubmitted] = useState(false);
  

  // Debugging: Ensure state change and re-renders are logged.
  useEffect(() => {
    console.log("Home component re-rendered");
    console.log("reportSubmitted:", reportSubmitted);
  }, [reportSubmitted]);

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {!reportSubmitted ? (
        <CameraImageCapture 
          onReportSubmit={() => {
            setReportSubmitted(true);
          }}
        />
      ) : (
        <Letter
          recipient="John Doe"
          initialTitle="Greetings!"
          initialBody="I hope this message finds you well."
        /> 
      )}
    </div>
  );
}
