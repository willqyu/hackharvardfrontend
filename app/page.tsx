

"use client";

import React, { useState, useEffect } from "react";
import CameraImageCapture from "./ui/camera";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen bg-pink-300">  
      <CameraImageCapture/>
    </div>
  );
}
