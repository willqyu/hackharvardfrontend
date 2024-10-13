import React, { useState } from 'react';
// import ticketsHtml from '@/app/ui/htmlMaps/tickets.html';



const SlidingReel = () => {
  const [expandedBox, setExpandedBox] = useState<number | null>(null); // Ensure type is number | null
  const htmlFiles = ['@/app/ui/htmlMaps/tickets.html', '@/app/ui/htmlMaps/tickets.html']; // Replace with your HTML map files


  const handleClick = (index: number) => {
    const isSameBox = expandedBox === index;
    setExpandedBox(isSameBox ? null : index);
  };
  

  return (
    <div className="grid items-center justify-items-center min-h-screen bg-gradient-to-tr from-slate-800 to-slate-950 bg-pink-300">
      <div className="flex overflow-x-auto space-x-4 p-4">
        {htmlFiles.map((file, index) => (
          <div
            key={index}
            className={`transition-transform duration-300 ease-in-out ${
              expandedBox === index ? 'w-full h-full' : 'w-60 h-60'
            } flex-shrink-0 bg-white rounded-lg shadow-md cursor-pointer`}
            onClick={() => handleClick(index)}
          >
            {expandedBox === index ? (
              <iframe
                src={file}
                title={`Map ${index + 1}`}
                className="w-full h-full"
                style={{ border: 'none' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-2xl font-bold">
                Map {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidingReel;
