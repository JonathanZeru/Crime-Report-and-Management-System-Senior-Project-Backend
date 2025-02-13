import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method === 'GET') {

    const { sajenId } = req.query;

    try {
      if (sajenId || Array.isArray(sajenId)) {
      
      const myCases = await prisma.caseSajen.findMany(
        { orderBy: {
          createdAt: 'desc'
        },
            where: {
                sajenId: Number(sajenId),
            },
            include:{
                case: true
            }
        }
      );

      if (!myCases) {
        return res.status(404).json({ error: 'case not found' });
      }

      res.status(200).json(myCases); 
    }
    } catch (error) {
      console.error('Error retrieving case:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
