import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';
const genAI = new GoogleGenerativeAI('AIzaSyC7S7olMKO6GU9s3U9kgBhI8RBSzmR9B94');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const config = {
  api: {
    bodyParser: false,
  },
};

const authenticateRequest = (req: NextApiRequest): jwt.JwtPayload | null => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null; 
  }

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
  } catch (error) {
    return null; 
  }
};

const analyzeCrimeSeverity = async (
  description: string,
  natureOfCrime: string,
  crimeDetail: string
) => {
  const prompt = `
  Analyze the following crime details:
  Description: ${description}
  Nature of Crime: ${natureOfCrime}
  Crime Details: ${crimeDetail}

  Based on the severity model:
  - High-Level Crimes: Severe consequences with significant harm.
  - Medium-Level Crimes: Serious but less severe than high-level.
  - Low-Level Crimes: Minor offenses with lesser penalties.

  Assign a severity level (High Level, Medium Level, or Low Level) and respond with one of these levels.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result?.response?.text?.();
    console.log('Severity Analysis Result:', responseText?.trim());
    return responseText?.trim() || 'Unable to determine severity due to invalid response.';
  } catch (error) {
    console.error("Error during AI analysis:", error);
    return 'Unable to determine severity due to an AI error.';
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

  // Authenticate the user
  const user = authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }

  if (req.method === 'POST') {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      const getFieldValue = (field: any) => (Array.isArray(field) ? field[0] : field);

      const title = getFieldValue(fields.title);
      console.log('Title:', title);

      const description = getFieldValue(fields.description);
      console.log('Description:', description);

      const natureOfCrime = getFieldValue(fields.natureOfCrime);
      console.log('Nature of Crime:', natureOfCrime);

      const crimeDetail = getFieldValue(fields.crimeDetail);
      console.log('Crime Detail:', crimeDetail);

      const dateReported = fields.dateReported ? new Date(getFieldValue(fields.dateReported)) : undefined;
      console.log('Date Reported:', dateReported);

      const dateOfIncidentOccured = fields.dateOfIncidentOccured ? new Date(getFieldValue(fields.dateOfIncidentOccured)) : undefined;
      console.log('Date of Incident Occured:', dateOfIncidentOccured);

      const crimeCityUniqueName = getFieldValue(fields.crimeCityUniqueName);
      console.log('Crime City:', crimeCityUniqueName);

      // Full names of suspects and arrested suspects from the frontend (Assuming IDs are provided)
      const fullNamesOfSuspects = JSON.parse(getFieldValue(fields.fullNamesOfSuspects)); // Expecting an array of suspect names
      console.log('Full Names of Suspects:', fullNamesOfSuspects);

      const fullNamesOfArrestedSuspects = JSON.parse(getFieldValue(fields.fullNamesOfArrestedSuspects)); // Expecting an array of arrested suspect names
      console.log('Full Names of Arrested Suspects:', fullNamesOfArrestedSuspects);

      const reporterType = getFieldValue(fields.reporterType);
      console.log('Reporter Type:', reporterType);

      const resourceNamePath = getFieldValue(fields.resourceName);
      console.log('Resource Name Path:', resourceNamePath);

      const userID = user.id; // Use authenticated user's ID
      console.log('User ID:', userID);

      const uploadDir = path.join(process.cwd(), '/public/uploads/');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const moveFile = (file: File, dir: string) => {
        const newFilePath = path.join(dir, file.newFilename || 'default.png');
        fs.renameSync(file.filepath, newFilePath);
        return `/uploads/${file.newFilename || 'default.png'}`;
      };

      const videoFile = files.video;
      console.log('Video File:', videoFile);

      const audioFile = files.audio;
      console.log('Audio File:', audioFile);

      const imageFile = files.image;
      console.log('Image File:', imageFile);

      const video = videoFile ? moveFile(Array.isArray(videoFile) ? videoFile[0] : videoFile, uploadDir) : null;
      console.log('Video Path:', video);

      const audio = audioFile ? moveFile(Array.isArray(audioFile) ? audioFile[0] : audioFile, uploadDir) : null;
      console.log('Audio Path:', audio);

      const image = imageFile ? moveFile(Array.isArray(imageFile) ? imageFile[0] : imageFile, uploadDir) : null;
      console.log('Image Path:', image);

      try {
        // const severityAnalysis = await analyzeCrimeSeverity(description, natureOfCrime, crimeDetail);
        // console.log('Severity Analysis:', severityAnalysis);

        // let caseLevelOfCrime = '';
        // if (severityAnalysis.includes('High-Level')) {
        //   caseLevelOfCrime = 'High Level';
        // } else if (severityAnalysis.includes('Medium-Level')) {
        //   caseLevelOfCrime = 'Medium Level';
        // } else {
        //   caseLevelOfCrime = 'Low Level';
        // }

        // Create suspects without checking for existence
        const createdSuspects = await Promise.all(
          fullNamesOfSuspects.map(async (suspectName: string) => {
            const suspect = await prisma.suspects.create({
              data: { fullNme: suspectName, isArrested: false },
            });
            return suspect;
          })
        );

        // Create arrested suspects without checking for existence
        const createdArrestedSuspects = await Promise.all(
          fullNamesOfArrestedSuspects.map(async (suspectName: string) => {
            const arrestedSuspect = await prisma.suspects.create({
              data: { fullNme: suspectName, isArrested: true },
            });
            return arrestedSuspect;
          })
        );

        const newCase = await prisma.case.create({
          data: {
            title,
            description,
            status: 'Pending',
            caseLevelOfCrime: 'Not Classfied',
            natureOfCrime,
            crimeDetail,
            dateReported,
            dateOfIncidentOccured,
            crimeCityUniqueName,
            fullNamesOfSuspects: {
              connect: createdSuspects.map((suspect) => ({ id: suspect.id })),
            },
            fullNamesOfArrestedSuspects: {
              connect: createdArrestedSuspects.map((suspect) => ({ id: suspect.id })),
            },
            isAssigned: false,
            isClassified: false,
            userId: Number(userID),
            policeHeadId: (await prisma.policeHead.findFirst())?.id || 0,
          },
        });

        console.log('New Case Created:', newCase);

        await prisma.technicalReport.create({
          data: {
            caseId: newCase.id,
            reportDetails: description,
            reportWord: crimeDetail,
            isDirectEyeWitness: reporterType === 'eyewitness',
            isFromAccuser: reporterType === 'accuser',
            isFromThirdPerson: reporterType === 'thirdPerson',
            isFromContactThirdPerson: reporterType === 'contactThirdPerson',
          },
        });
        console.log('Technical Report Created.');

        await prisma.tacticalReport.create({
          data: {
            caseId: newCase.id,
            reportDetails: crimeDetail,
            picture: image,
            video,
            audio,
            resourceName: resourceNamePath,
          },
        });
        console.log('Tactical Report Created.');

        res.status(201).json({
          message: 'Case and reports created successfully with severity analysis',
          data: newCase
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