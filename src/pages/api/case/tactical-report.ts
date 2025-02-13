// api/tactical-report.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to move uploaded files
const moveFile = (file: File, dir: string) => {
  const newFilePath = path.join(dir, file.newFilename || 'default.png');
  fs.renameSync(file.filepath, newFilePath);
  return `/uploads/${file.newFilename || 'default.png'}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173';

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'PUT') {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      const caseId = Number(fields.caseId);
      if (!caseId) {
        return res.status(400).json({ error: 'Case ID is required' });
      }

      const reportDetails = fields.reportDetails?.toString();

      const uploadDir = path.join(process.cwd(), '/public/uploads/');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const videoFile = files.video;
      const audioFile = files.audio;
      const imageFile = files.image;

      const video = videoFile ? moveFile(Array.isArray(videoFile) ? videoFile[0] : videoFile, uploadDir) : null;
      const audio = audioFile ? moveFile(Array.isArray(audioFile) ? audioFile[0] : audioFile, uploadDir) : null;
      const image = imageFile ? moveFile(Array.isArray(imageFile) ? imageFile[0] : imageFile, uploadDir) : null;

      try {
        const updatedTacticalReport = await prisma.tacticalReport.updateMany({
          where: { caseId },
          data: {
            reportDetails,
            video,
            audio,
            picture: image,
          },
        });

        if (updatedTacticalReport.count === 0) {
          return res.status(404).json({ error: 'No tactical report found for the given case ID' });
        }

        res.status(200).json({
          message: 'Tactical report updated successfully',
          updatedTacticalReport,
        });
      } catch (error) {
        console.error('Error updating tactical report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
