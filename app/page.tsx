"use client";

import React, { useState } from "react";
import CameraImageCapture from "./ui/camera";
import Letter from "./ui/letter";

export default function Home() {
  const [reportSubmitted, setReportSubmitted] = useState(false);

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {!reportSubmitted ? (
        <CameraImageCapture onReportSubmit={() => setReportSubmitted(true)} />
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
