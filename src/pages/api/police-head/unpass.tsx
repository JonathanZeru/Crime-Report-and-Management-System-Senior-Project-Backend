import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); 
    return res.status(204).end();
  }

  if (req.method === 'DELETE') {
    const { caseId } = req.query;

    if (!caseId) {
      return res.status(400).json({ error: 'caseId is required' });
    }

    try {
      // Fetch the current case details
      const caseToUpdate = await prisma.case.findUnique({
        where: { id: parseInt(caseId as string, 10) },
      });

      if (!caseToUpdate) {
        return res.status(404).json({ error: 'Case not found' });
      }

      // Update the case to unassign the inspector
      const updatedCase = await prisma.case.update({
        where: { id: parseInt(caseId as string, 10) },
        data: {
          prosecutor: { disconnect: true }, // Unassign the inspector
          isAssigned: true,
          status: "Assigned",
        }
      });
      res.status(200).json({
        message: 'Prosecutor unassigned successfully',
        data: updatedCase,
      });
    } catch (error) {
      console.error('Error occurred while unassigning prosecutor from case:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
