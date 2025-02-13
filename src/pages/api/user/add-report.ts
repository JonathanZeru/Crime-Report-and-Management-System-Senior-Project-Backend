import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to authenticate token
const authenticateToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; 
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); 
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }
      const getFieldValue = (field: any) => (Array.isArray(field) ? field[0] : field);

      const caseId = getFieldValue(fields.caseId);
      const description = getFieldValue(fields.description);
      const crimeDetail = getFieldValue(fields.crimeDetail);
     
      const reporterType = getFieldValue(fields.reporterType);
      const resourceNamePath = getFieldValue(fields.resourceName);

      const moveFile = (file: File, dir: string) => {
        const newFilePath = path.join(dir, file.newFilename || 'default.png');
        fs.renameSync(file.filepath, newFilePath);
        return `/uploads/${file.newFilename || 'default.png'}`;
      };

      const videoFile = files.video;
      const audioFile = files.audio;
      const imageFile = files.image;

      const uploadDir = path.join(process.cwd(), '/public/uploads/');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const video = videoFile ? moveFile(Array.isArray(videoFile) ? videoFile[0] : videoFile, uploadDir) : null;
      const audio = audioFile ? moveFile(Array.isArray(audioFile) ? audioFile[0] : audioFile, uploadDir) : null;
      const image = imageFile ? moveFile(Array.isArray(imageFile) ? imageFile[0] : imageFile, uploadDir) : null;
      try {
        
        const technicalReport = await prisma.technicalReport.create({
          data: {
            caseId: Number(caseId),
            reportDetails: description,
            reportWord: crimeDetail,
            isDirectEyeWitness: reporterType == 'eyewitness',
            isFromAccuser: reporterType == 'accuser',
            isFromThirdPerson: reporterType == 'thirdPerson',
            isFromContactThirdPerson: reporterType == 'contactThirdPerson',
          },
        });

        const tacticalReport = await prisma.tacticalReport.create({
          data: {
            caseId: Number(caseId),
            reportDetails: crimeDetail,
            picture: image,
            video,
            audio,
            resourceName: resourceNamePath
          },
        });

        res.status(201).json({
          message: 'Technical and Tactical report created successfully',
          data: {
            "Technical Report": technicalReport,
            "Tactical Report":tacticalReport
          }
        });
      } catch (error) {
        console.error('Error creating case:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
