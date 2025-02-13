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

    const { id } = req.query;

    try {
      if (id || Array.isArray(id)) {
      
     
      const user = await prisma.deskOfficer.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        return res.status(404).json({ error: 'deskOfficer not found' });
      }

      res.status(200).json(user); 
    }else{
      const user = await prisma.deskOfficer.findMany({
            orderBy: {
              createdAt: 'desc' // Adjust the field name based on your schema
            },
      });

      res.status(200).json(user); 
    }
    } catch (error) {
      console.error('Error retrieving deskOfficer:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
