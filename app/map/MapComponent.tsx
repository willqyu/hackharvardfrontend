'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapItem } from './MapDataServer';

// Ensure the default leaflet marker icons are properly loaded
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

// Custom icon for map markers
const customIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [1, -34],
  });

interface MapComponentProps {
  mapData: MapItem[];
}

export default function MapComponent({ mapData }: MapComponentProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (mapData.length > 0) {
      setMapCenter([mapData[0].latitude, mapData[0].longitude]);
    }
  }, [mapData]);

  return (
    <MapContainer center={mapCenter} zoom={2} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {mapData.map((item) => (
        <Marker 
          key={item.id} 
          position={[item.latitude, item.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div>
              <p>{item.comment}</p>
              <img src={item.image} alt="Location" style={{ maxWidth: '100%', height: 'auto' }} />
              <p>Timestamp: {new Date(item.timestamp).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}