import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method === 'GET') {
    const { inspectorId } = req.query;

    if (!inspectorId || typeof inspectorId !== 'string') {
      return res.status(400).json({ error: 'Inspector id is required and must be a string' });
    }

    try {
      // Fetch all sajens under the inspector
      const sajensUnderInspector = await prisma.inspectorSajen.findMany({
        where: { inspectorId: parseInt(inspectorId, 10), },
        include:{
          sajen: true
        }
      });

      if (!sajensUnderInspector.length) {
        return res.status(404).json({ error: 'No sajens found for the inspector' });
      }

      res.status(200).json(sajensUnderInspector);
    } catch (error) {
      console.error('Error occurred while fetching sajens:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
