import React, { useState } from 'react';
import Image from 'next/image';
import ticketMap from '@/app/ui/htmlMaps/tickets.png';
import zoomedOut from '@/app/ui/htmlMaps/zoomedOut.png';

const SlidingReel = () => {
  const [expandedBox, setExpandedBox] = useState<number | null>(null);

  const pics = [ticketMap, zoomedOut, ticketMap];

  const handleClick = (index: number) => {
    const isSameBox = expandedBox === index;
    setExpandedBox(isSameBox ? null : index);
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen">
      <div className="flex space-x-4 p-4">
        {pics.map((file, index) => (
          <div
            key={index}
            className={`relative transition-transform duration-500 ease-in-out ${
              expandedBox === index ? 'w-[80vw] h-[80vh]' : 'w-60 h-60'
            } flex-shrink-0 bg-white rounded-lg shadow-md cursor-pointer overflow-hidden`}
            onClick={() => handleClick(index)}
          >
            {expandedBox === index ? (
              <Image
                src={file}
                alt={`Map ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
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
