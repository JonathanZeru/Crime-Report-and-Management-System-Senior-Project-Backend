import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'PUT') {
    const form = new formidable.IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      // Extract fields
      const caseId = Number(fields.caseId);
      const reportDetails = fields.reportDetails?.toString();
      const reportWord = fields.reportWord?.toString();
      const sajenId = fields.sajenId ? Number(fields.sajenId) : null;
      const inspectorId = fields.inspectorId ? Number(fields.inspectorId) : null;
      const deskOfficerId = fields.deskOfficerId ? Number(fields.deskOfficerId) : null;

      const isDirectEyeWitness = fields.isDirectEyeWitness[0] === 'true';
      const isFromAccuser = fields.isFromAccuser[0] === 'true';
      const isFromThirdPerson = fields.isFromThirdPerson[0] === 'true';
      const isFromContactThirdPerson = fields.isFromContactThirdPerson[0] === 'true';

      // Validate required fields
      if (!caseId || !reportDetails || !reportWord) {
        return res.status(400).json({ error: 'caseId, reportDetails, and reportWord are required.' });
      }

      try {
        // Update technical report
        const updatedTechnicalReport = await prisma.technicalReport.updateMany({
          where: { caseId },
          data: {
            reportDetails,
            reportWord,
            sajenId,
            inspectorId,
            deskOfficerId,
            isDirectEyeWitness,
            isFromAccuser,
            isFromThirdPerson,
            isFromContactThirdPerson,
          },
        });

        if (updatedTechnicalReport.count === 0) {
          return res.status(404).json({ error: 'No technical report found for the given case ID' });
        }

        res.status(200).json({
          message: 'Technical report updated successfully',
          updatedTechnicalReport,
        });
      } catch (error) {
        console.error('Error updating technical report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
