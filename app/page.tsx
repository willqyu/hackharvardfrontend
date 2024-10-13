

"use client";

import React, { useState, useEffect } from "react";
import CameraImageCapture from "./ui/camera";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen bg-gradient-to-tr from-slate-800 to-slate-950  bg-pink-300">  
      <h1 className="text-white text-5xl my-6"><b>CiviClick</b></h1>
      <CameraImageCapture/>
    </div>
  );
}
