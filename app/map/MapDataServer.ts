import { sql } from '@vercel/postgres';

export interface MapItem {
  id: number;
  comment: string;
  image: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}

export async function getMapData(): Promise<MapItem[]> {
  try {
    const result = await sql<MapItem>`
      SELECT id, comment, image, timestamp, latitude, longitude
      FROM all_reports
      ORDER BY timestamp DESC
      LIMIT 100
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching map data:', error);
    return [];
  }
}