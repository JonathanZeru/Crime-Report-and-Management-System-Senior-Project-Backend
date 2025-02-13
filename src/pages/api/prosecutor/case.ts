import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin
  console.log("here at the back")

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method === 'GET') {
      const { prosecutorId } = req.query;
  
      if (!prosecutorId) {
        return res.status(400).json({ error: 'prosecutorId is required' });
      }
  
      try {
        // Fetch cases assigned to the prosecutor
        const cases = await prisma.case.findMany({
          where: { prosecutorId: Number(prosecutorId), },
          orderBy: {
            createdAt: 'desc' // Adjust the field name based on your schema
          }
       
        });
  console.log(cases)
        res.status(200).json(cases);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cases' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  