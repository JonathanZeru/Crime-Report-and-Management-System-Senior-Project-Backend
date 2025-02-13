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
      
     
      const user = await prisma.case.findUnique({
        where: { id: Number(id) },
        include:{
          technicalReports: true,
          tacticalReports: true,
          CaseSajen: {
            include:{
              sajen: true
            }
          },
          InspectorQuestionToSajen: 
          {
            include:{
              sajen: true,
              inspector: true
            }
          },
          Inspector: true,
          PoliceHeadQuestionToInspector: 
          {
            include:{
              inspector: true,
              policeHead: true
            }
          },
          ProsecutorCase: true,
          inspector: true,
          policeHead: true,
          prosecutor: true,
          ProsecutorQuestionToPoliceHead: 
          {
            include:{
              policeHead: true,
              prosecutor: true
            }
          },
          sajens: true,
          fullNamesOfArrestedSuspects: true,
          fullNamesOfSuspects: true,
          InspectorQuestionToUser: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'case not found' });
      }

      res.status(200).json(user); 
    }else{
      const user = await prisma.case.findMany({
            orderBy: {
              createdAt: 'desc' // Adjust the field name based on your schema
            }
      });

      res.status(200).json(user); 
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
