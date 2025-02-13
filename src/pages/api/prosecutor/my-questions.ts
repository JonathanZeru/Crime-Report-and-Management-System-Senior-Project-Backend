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

    const { prosecutorId, policeHeadId, caseId } = req.query;
    console.log(prosecutorId, policeHeadId)

    try {
      if (prosecutorId || Array.isArray(prosecutorId)) {

      const question = await prisma.prosecutorQuestionToPoliceHead.findMany({
        where: { 
          AND:{
            prosecutorId: Number(prosecutorId),
            policeHeadId: Number(policeHeadId),
            caseId: Number(caseId)
          }
         },
        orderBy: {
          createdAt: 'asc'
        },
        include: {
            policeHead: {
              select:{
                firstName: true,
                lastName: true,
                userName: true,
                profilePicture: true
              }
            },
            prosecutor: {
              select:{
                firstName: true,
                lastName: true,
                userName: true,
                profilePicture: true
              }
            }
        }
      });

      if (!question) {
        return res.status(404).json({ error: 'question not found' });
      }

      res.status(200).json(question); 
    }
    } catch (error) {
      console.error('Error retrieving question:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
