import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { caseId, sajenIds, inspectorId } = req.body; // Extract from request body
    const parsedInspectorId = parseInt(inspectorId, 10); // Parse inspectorId

    if (!caseId || !Array.isArray(sajenIds) || sajenIds.length === 0 || isNaN(parsedInspectorId)) {
      return res.status(400).json({ error: 'caseId, an array of sajenIds, and a valid inspectorId are required' });
    }

    try {
      // Step 1: Assign each sajen to the specified case in CaseSajen
      await prisma.caseSajen.createMany({
        data: sajenIds.map(sajenId => ({ caseId, sajenId })),
        skipDuplicates: true,
      });

      // Step 2: Add each sajen-inspector relationship to InspectorSajen
      await prisma.inspectorSajen.createMany({
        data: sajenIds.map(sajenId => ({
          inspectorId: parsedInspectorId,
          sajenId,
        })),
        skipDuplicates: true,
      });

      // Optionally fetch the updated case with associated sajens
      const updatedCase = await prisma.case.findUnique({
        where: { id: caseId },
        include: { sajens: true },
      });
      await prisma.case.update({
        where: { id: caseId },
        data:{
          status: "Under Investigation"
        }
      })
      res.status(200).json({
        message: 'Sajens assigned to case and connected to inspector successfully',
        data: updatedCase,
      });
    } catch (error) {
      console.error('Error while assigning sajens:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
