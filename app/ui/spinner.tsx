import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-8 h-8 border-8 border-t-transparent border-blue-500 rounded-full"
      style={{ animation: "spin 0.5s linear infinite" }}></div>
    </div>
  );
};

export default LoadingSpinner;
