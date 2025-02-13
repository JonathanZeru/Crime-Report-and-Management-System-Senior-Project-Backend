import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); 
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const { caseId, prosecutorId } = req.body;

    if (!caseId || !prosecutorId) {
      return res.status(400).json({ error: 'caseId and prosecutorId are required' });
    }

    try {
      // Assign the case to the prosecutor
      const currentCase = await prisma.case.findUnique({
        where: { id: Number(caseId) },
        include:{
          inspector: true
        }
      });
      if(currentCase.inspector == null){
        console.log("Case not assigned to inspector here")
      res.status(200).json({ message: 'Case not assigned to inspector' });
      }
      const updatedCase = await prisma.case.update({
        where: { id: caseId },
        data: {
          prosecutorId: prosecutorId,
          status: "Passed"
        }
      });

      res.status(200).json({ message: 'Case assigned to prosecutor successfully', case: updatedCase });
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign case to prosecutor' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
