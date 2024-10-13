import React, { useEffect, useRef } from 'react';


const GradientGauge = ({ value }) => {
  // Ensure the value stays within the 0-10 range
  const clampedValue = Math.max(0, Math.min(value, 10));
  const needleRef = useRef(null); // Create a ref for the needle

  useEffect(() => {
    // Calculate the needle position based on the value (scale from 0 to 10)
    const needlePosition = (clampedValue / 10) * 100; // Convert to percentage
    if (needleRef.current) {
      needleRef.current.style.left = `${needlePosition}%`; // Update needle position
    }
  }, [clampedValue]); // Run this effect whenever clampedValue changes

  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="relative w-72 h-8">
        {/* Gradient background */}
        <div className="absolute rounded-xl inset-0 bg-gradient-to-r from-red-500 to-green-500 shadow-md shadow-slate-700"></div>
        {/* Needle */}
        <div
          ref={needleRef} // Attach the ref to the needle
          className="absolute w-1 h-8 bg-white transition-left duration-300 ease-in-out" // Add transition for left property
          style={{
            transform: 'translateX(-50%)', // Center the needle on its position
          }}
        />
      </div>
      <div className="mt-2 text-xl text-white font-bold">{clampedValue.toFixed(1)}</div>
    </div>
  );
};

export default GradientGauge;
