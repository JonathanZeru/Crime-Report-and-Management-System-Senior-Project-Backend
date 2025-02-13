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
    const { caseId, inspectorId, accuserId } = req.body;

    if (!caseId || !inspectorId || !accuserId) {
      return res.status(400).json({ error: 'caseId, inspectorId, and accuserId are required' });
    }

    try {
      // Fetch the current case and inspector details
      const [caseToUpdate, inspector] = await Promise.all([
        prisma.case.findUnique({
          where: { id: caseId },
          include: { user: true }, // Fetch the case and its associated user (accuser)
        }),
        prisma.inspector.findUnique({
          where: { id: inspectorId },
        }),
      ]);

      if (!caseToUpdate) {
        return res.status(404).json({ error: 'Case not found' });
      }

      if (!inspector) {
        return res.status(404).json({ error: 'Inspector not found' });
      }

      const updatedCase = await prisma.case.update({
        where: { id: caseId },
        data: {
          inspector: { connect: { id: inspectorId } },
          isCrime: true,
          isAssigned: true, 
          status: "Assigned"
        },
      });

      // Create a notification for the user
      await prisma.notification.create({
        data: {
          userId: accuserId, // Notify the user who reported the case
          content: `The case "${updatedCase.title}" has been assigned to Inspector ${inspector.firstName} ${inspector.lastName}.`,
        },
      });

      res.status(200).json({
        message: 'Case assigned to inspector, updated successfully, and notification sent',
        data: updatedCase,
      });
    } catch (error) {
      console.error('Error occurred while assigning case to inspector:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
