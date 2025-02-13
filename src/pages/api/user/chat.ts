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

    const { caseId, userId, inspectorId } = req.query;

    try {
        const user = await prisma.inspectorQuestionToUser.findMany({
            where:{
               AND: {
                caseId: Number(caseId), 
                userId: Number(userId),
                inspectorId: Number(inspectorId),
               }
            },
                orderBy: {
                  createdAt: 'asc'
                },
                include:{
                    inspector: true,
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                        userName: true,
                        profilePicture: true
                      }
                    }
                }
          });
          console.log(user)
    
          res.status(200).json(user); 
    } catch (error) {
      console.error('Error retrieving policeHead:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
