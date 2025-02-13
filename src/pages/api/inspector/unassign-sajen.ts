import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'DELETE') {
    const { sajenId, caseId } = req.query; // Extract sajenId and caseId from query parameters

    const parsedSajenId = parseInt(sajenId as string, 10);
    const parsedCaseId = parseInt(caseId as string, 10);

    if (isNaN(parsedSajenId) || isNaN(parsedCaseId)) {
      return res.status(400).json({ error: 'Valid sajenId and caseId are required' });
    }

    try {
      // Step 1: Delete the association in CaseSajen
      await prisma.caseSajen.delete({
        where: {
          caseId_sajenId: { caseId: parsedCaseId, sajenId: parsedSajenId },
        },
      });

      // Step 2: Remove the association in InspectorSajen (if any)
      await prisma.inspectorSajen.deleteMany({
        where: { sajenId: parsedSajenId },
      });

      // Optionally fetch the updated case to confirm unassignment
      const updatedCase = await prisma.case.findUnique({
        where: { id: parsedCaseId },
        include: { sajens: true },
      });

      res.status(200).json({
        message: 'Sajen successfully unassigned from the case',
        data: updatedCase,
      });
    } catch (error) {
      console.error('Error while unassigning sajen:', error);

      // Handle specific error scenarios
      if (error.code === 'P2025') { // Prisma error for record not found
        return res.status(404).json({ error: 'Sajen or case not found' });
      }

      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
