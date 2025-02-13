import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

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

      const firstName = Array.isArray(fields.firstName) ? fields.firstName[0] : fields.firstName;
      const lastName = Array.isArray(fields.lastName) ? fields.lastName[0] : fields.lastName;
      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
      const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
      const userName = Array.isArray(fields.userName) ? fields.userName[0] : fields.userName;


      const moveFile = (file: File, dir: string) => {
        const newFilePath = path.join(dir, file.newFilename || 'default.png');
        fs.renameSync(file.filepath, newFilePath);
        return `/uploads/${file.newFilename || 'default.png'}`;
      };

      console.log(fields);
      console.log(files);

      const kebeleIdFileFront = files.kebeleIdPictureFront;
      const kebeleIdFileBack = files.kebeleIdPictureBack;
      if (!kebeleIdFileFront) {
        return res.status(400).json({ error: 'Kebele ID front file is required' });
      }
      if (!kebeleIdFileBack) {
        return res.status(400).json({ error: 'Kebele ID back file is required' });
      }
      const uploadDir = path.join(process.cwd(), '/public/uploads/');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const kebeleIdPathFront = moveFile(Array.isArray(kebeleIdFileFront) ? kebeleIdFileFront[0] : kebeleIdFileFront, uploadDir);
      const kebeleIdPathBack = moveFile(Array.isArray(kebeleIdFileBack) ? kebeleIdFileBack[0] : kebeleIdFileBack, uploadDir);

      const profilePictureFile = files.profilePicture;
      if (!profilePictureFile) {
        return res.status(400).json({ error: 'Profile picture is required' });
      }
      const profilePicturePath = moveFile(Array.isArray(profilePictureFile) ? profilePictureFile[0] : profilePictureFile, uploadDir);

      if (!firstName || !lastName || !phone || !password ) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      console.log(fields);
      console.log(files);
      

      try {
        const existingEmail = await prisma.user.findUnique({
          where: { email },
        });
        if (existingEmail) {
          return res.status(409).json({ error: 'Email is already in use' });
        }

        const existingUsername = await prisma.user.findUnique({
          where: { userName },
        });
        if (existingUsername) {
          return res.status(409).json({ error: 'Username is already in use' });
        }

        const existingPhone = await prisma.user.findUnique({
          where: { phone },
        });
        if (existingPhone) {
          return res.status(409).json({ error: 'Phone number is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            userName,
            kebeleIdPictureBack: kebeleIdPathBack,
            kebeleIdPictureFront: kebeleIdPathFront, 
            profilePicture: profilePicturePath,
            isActive: true
          },
        });

        res.status(201).json({
          message: 'User registration successful',
          data: newUser,
        });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper function to save file and return its path
async function saveFile(file: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), '/public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const newFilePath = path.join(uploadDir, file.newFilename || 'default.png');
  fs.renameSync(file.filepath, newFilePath);

  return `/uploads/${file.newFilename || 'default.png'}`;
}
