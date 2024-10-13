

"use client";

import React, { useState, useEffect } from "react";
import CameraImageCapture from "./ui/camera";
import SlidingReel from "./ui/maps";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen bg-gradient-to-tr from-slate-800 to-slate-950  bg-pink-300">  
      <h1 className="text-white text-xl my-3"><b>CiviClick</b></h1>
      <nav className="bg-gray-800 text-white p-3 rounded-full shadow-md mb-6">
        <ul className="flex justify-evenly items-center space-x-4">
          <li>
            <button className="= hover:bg-gray-900 text-white py-2 px-2 rounded-full shadow-xl">
              <Link href="#map" scroll={false}>
                Dashboard
              </Link>
            </button>
          </li>
          <li>
            <button className=" hover:bg-black text-white py-2 px-4 rounded-full shadow-xl">
              <Link href="#tweets" scroll={false}>
                Sentiment Feed
              </Link>
            </button>
          </li>
          <li>
            <button className=" hover:bg-black text-white py-2 px-4 rounded-full shadow-xl">
              <Link href="#mappage" scroll={false}>
                Maps
              </Link>
            </button>
          </li>
        </ul>
      </nav>

      <CameraImageCapture/>
      <SlidingReel/>
    </div>
  );
}
