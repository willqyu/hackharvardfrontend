import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await sql`
      SELECT id, comment, image, timestamp, latitude, longitude
      FROM all_reports
      ORDER BY timestamp DESC
      LIMIT 100
    `;

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching map data:', error);
    res.status(500).json({ error: 'Error fetching map data' });
  }
}