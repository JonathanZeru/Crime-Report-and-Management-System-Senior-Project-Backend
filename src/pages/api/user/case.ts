import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required and must be a string' });
    }

    try {
      // Fetch all cases for the user with all related data
      const userWithCases = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
        include: {
          cases: {
            include: {
              inspector: true,
              policeHead: true,
              prosecutor: true,
              sajens: true,
              technicalReports: true,
              tacticalReports: true,
              CaseSajen: true,
              ProsecutorQuestionToPoliceHead: true,
              PoliceHeadQuestionToInspector: true,
              InspectorQuestionToSajen: true,
              ProsecutorCase: true,
            },
          },
        },
      });

      if (!userWithCases) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({
        cases: userWithCases.cases,
      });
    } catch (error) {
      console.error('Error occurred while fetching user cases:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
