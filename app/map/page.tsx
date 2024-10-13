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
  console.log(typeof(mapData[0].image))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"></h1>
      <div style={{ height: '600px', width: '100%' }}>
        <Suspense fallback={<div>Loading map...</div>}>
          <MapComponent mapData={mapData} />
        </Suspense>
      </div>
    </div>
  );
}