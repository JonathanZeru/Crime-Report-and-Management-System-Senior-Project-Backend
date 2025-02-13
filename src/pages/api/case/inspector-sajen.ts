import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { caseId } = req.query;
    console.log(req.query)
    if (!caseId || typeof caseId !== 'string') {
      return res.status(400).json({ error: 'caseId is required' });
    }

    try {
      // Fetch the Case with the inspectorId
      const caseData = await prisma.case.findUnique({
        where: { id: Number(caseId) },
        select: {
          inspectorId: true,
          sajens: {
            include: {
              inspector: true,
            },
          },
        },
      });

      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      // Fetch the Inspector
      const inspector = await prisma.inspector.findUnique({
        where: { id: caseData.inspectorId },
        include: {
          sajen: true,
        },
      });

      if (!inspector) {
        return res.status(404).json({ error: 'Inspector not found' });
      }

      // Fetch the Sajens that are under the inspector
      const sajensUnderInspector = inspector.sajen;
      res.status(200).json({
        case: caseData,
        inspector,
        sajensUnderInspector,
      });
    } catch (error) {
      console.error('Error occurred while fetching case, inspector, and sajens:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
