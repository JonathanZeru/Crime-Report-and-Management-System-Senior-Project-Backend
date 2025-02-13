import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Initialize Prisma Client
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

// Helper function to authenticate token
const authenticateToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query; // '1' for TechnicalReport, '2' for TacticalReport

  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token is required' });
    }

    const payload = authenticateToken(token);

    if (!payload || !payload.id) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      const caseId = Array.isArray(fields.caseId) ? fields.caseId[0] : fields.caseId;
      const deskOfficerId = Array.isArray(fields.deskOfficerId) ? fields.deskOfficerId[0] : fields.deskOfficerId;
      const reportDetails = Array.isArray(fields.reportDetails) ? fields.reportDetails[0] : fields.reportDetails;

      const imageFile = files.image;
      const videoFile = files.video;
      const audioFile = files.audio;

      let image: File | null = null;
      let video: File | null = null;
      let audio: File | null = null;

      if (Array.isArray(imageFile)) image = imageFile[0];
      else if (imageFile) image = imageFile;

      if (Array.isArray(videoFile)) video = videoFile[0];
      else if (videoFile) video = videoFile;

      if (Array.isArray(audioFile)) audio = audioFile[0];
      else if (audioFile) audio = audioFile;

      const uploadDir = path.join(process.cwd(), '/public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const moveFile = (file: File, dir: string) => {
        const newFilePath = path.join(dir, file.newFilename || 'default.png');
        fs.renameSync(file.filepath, newFilePath);
        return `/uploads/${file.newFilename || 'default.png'}`;
      };

      const imagePath = image ? moveFile(image, uploadDir) : '';
      const videoPath = video ? moveFile(video, uploadDir) : '';
      const audioPath = audio ? moveFile(audio, uploadDir) : '';

      try {
        if (type === '1') {
          // TechnicalReport
          const { reportWord, isDirectEyeWitness, isFromAccuser, isFromThirdPerson, isFromContactThirdPerson } = fields;

          if (
            !caseId ||
            !deskOfficerId ||
            !reportDetails ||
            !reportWord ||
            isDirectEyeWitness === undefined ||
            isFromAccuser === undefined ||
            isFromThirdPerson === undefined ||
            isFromContactThirdPerson === undefined
          ) {
            return res.status(400).json({ error: 'All fields are required for TechnicalReport' });
          }

          const report = await prisma.technicalReport.create({
            data: {
              deskOfficerId: Number(deskOfficerId),
              caseId: Number(caseId),
              reportDetails,
              reportWord: String(reportWord),
              isDirectEyeWitness: Boolean(isDirectEyeWitness),
              isFromAccuser: Boolean(isFromAccuser),
              isFromThirdPerson: Boolean(isFromThirdPerson),
              isFromContactThirdPerson: Boolean(isFromContactThirdPerson)
            },
          });

          return res.status(201).json({ message: 'Technical report created successfully', report });
        } else if (type === '2') {
          // TacticalReport
          const { resourceName } = fields;

          if (
            !caseId ||
            !deskOfficerId ||
            !reportDetails ||
            !resourceName
          ) {
            return res.status(400).json({ error: 'All fields are required for TacticalReport' });
          }

          const report = await prisma.tacticalReport.create({
            data: {
              deskOfficerId: Number(deskOfficerId),
              caseId: Number(caseId),
              reportDetails,
              resourceName: String(resourceName),
              picture: imagePath,
              video: videoPath,
              audio: audioPath
            },
          });

          return res.status(201).json({ message: 'Tactical report created successfully', report });
        } else {
          return res.status(400).json({ error: 'Invalid report type' });
        }
      } catch (error) {
        console.error('Error creating report:', error);
        return res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
