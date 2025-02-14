import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || '';

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

const moveFile = (file: File, dir: string) => {
  const newFilePath = path.join(dir, file.newFilename || 'default.png');
  fs.renameSync(file.filepath, newFilePath);
  return `/uploads/${file.newFilename || 'default.png'}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  if (req.method === 'PUT') {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userPayload = authenticateToken(token);
      if (!userPayload || !userPayload.id) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const userId = userPayload.id;

      const firstName = Array.isArray(fields.firstName) ? fields.firstName[0] : fields.firstName;
      const lastName = Array.isArray(fields.lastName) ? fields.lastName[0] : fields.lastName;
      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
      const userName = Array.isArray(fields.userName) ? fields.userName[0] : fields.userName;

      const uploadDir = path.join(process.cwd(), '/public/uploads/');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      let profilePicturePath = null;
      if (files.profilePicture) {
        const profilePictureFile = Array.isArray(files.profilePicture)
          ? files.profilePicture[0]
          : files.profilePicture;
        profilePicturePath = moveFile(profilePictureFile, uploadDir);
      }

      let kebeleIdPathFront = null;
      if (files.kebeleIdPictureFront) {
        const kebeleIdFile = Array.isArray(files.kebeleIdPictureFront)
          ? files.kebeleIdPictureFront[0]
          : files.kebeleIdPictureFront;
        kebeleIdPathFront = moveFile(kebeleIdFile, uploadDir);
      }
      let kebeleIdPathBack = null;
      if (files.kebeleIdPictureBack) {
        const kebeleIdFile = Array.isArray(files.kebeleIdPictureBack)
          ? files.kebeleIdPictureBack[0]
          : files.kebeleIdPictureBack;
        kebeleIdPathBack = moveFile(kebeleIdFile, uploadDir);
      }

      if (!firstName || !lastName || !phone || !userName) {
        return res.status(400).json({ error: 'All fields are required except password' });
      }

      try {
        if (email) {
          const existingEmail = await prisma.user.findFirst({
            where: {
              AND:{
                email,
              id: { not: userId }
              }
            }
          });
          if (existingEmail) {
            return res.json({ error: 'Email is already in use by another user' });
          }
        }
      
        if (userName) {
          const existingUsername = await prisma.user.findFirst({
            where: {
              userName,
              id: { not: userId },
            },
          });
          if (existingUsername) {
            return res.status(409).json({ error: 'Username is already in use by another user' });
          }
        }
      
        if (phone) {
          const existingPhone = await prisma.user.findFirst({
            where: {
              phone,
              id: { not: userId },
            },
          });
          if (existingPhone) {
            return res.status(409).json({ error: 'Phone number is already in use by another user' });
          }
        }
      
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            firstName,
            lastName,
            email,
            phone,
            userName, 
            ...(profilePicturePath && { profilePicture: profilePicturePath }),
            ...(kebeleIdPathBack && { kebeleIdPictureBack: kebeleIdPathBack }),
            ...(kebeleIdPathFront && { kebeleIdPictureFront: kebeleIdPathFront }),
          },
        });
      
        res.status(200).json({
          message: 'User profile updated successfully',
          data: updatedUser,
        });
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      
    });
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
