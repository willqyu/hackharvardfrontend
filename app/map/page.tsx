import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getMapData, MapItem } from './MapDataServer';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default async function MapPage() {
  const mapData = await getMapData();
  // console.log(typeof(mapData[0].image))

  return (
    <div className="bg-gradient-to-tr from-slate-800 to-slate-950">
      <div className="container mx-auto p-4">
      <h1 className="mt-6 mb-6 text-center text-5xl text-white shadow-md font-bold"> 
        Report dashboard 
      </h1>
      <p className="text-white mb-5 text-center text-lg">
        Zoom in to see where constituents are reporting issues. 
      </p>
      <div className="h-[600px] w-full rounded-2xl overflow-hidden">
        <Suspense fallback={<div>Loading map...</div>}>
          <MapComponent mapData={mapData} />
        </Suspense>
      </div>

    </div>
    </div>
  );
}