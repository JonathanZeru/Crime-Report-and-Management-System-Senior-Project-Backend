import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight request
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      // Extracting fields
      const firstName = Array.isArray(fields.firstName) ? fields.firstName[0] : fields.firstName;
      const lastName = Array.isArray(fields.lastName) ? fields.lastName[0] : fields.lastName;
      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
      const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
      const userName = Array.isArray(fields.userName) ? fields.userName[0] : fields.userName;
      const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;

      // Function to move files
      const moveFile = (file: File, dir: string) => {
        const newFilePath = path.join(dir, file.newFilename || 'default.png');
        fs.renameSync(file.filepath, newFilePath);
        return `/uploads/${file.newFilename || 'default.png'}`;
      };

      console.log(fields);
      console.log(files);

      // Handling Kebele ID file
      const kebeleIdFileFront = files.kebeleIdPictureFront;
      const kebeleIdFileBack = files.kebeleIdPictureBack;
      if (!kebeleIdFileFront || !kebeleIdFileBack) {
        return res.status(400).json({ error: 'Kebele ID file is required' });
      }
      const uploadDir = path.join(process.cwd(), '/public/uploads/');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const kebeleIdPathFront = moveFile(Array.isArray(kebeleIdFileFront)
       ? kebeleIdFileFront[0] : kebeleIdFileFront, uploadDir);
      const kebeleIdPathBack = moveFile(Array.isArray(kebeleIdFileBack) ?
       kebeleIdFileBack[0] : kebeleIdFileBack, uploadDir);

      // Handling profile picture
      const profilePictureFile = files.profilePicture;
      if (!profilePictureFile) {
        return res.status(400).json({ error: 'Profile picture is required' });
      }
      const profilePicturePath = moveFile(Array.isArray(profilePictureFile) ? profilePictureFile[0] : profilePictureFile, uploadDir);

      // Validate fields
      if (!firstName || !lastName || !phone || !password || !type) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      console.log(fields);
      console.log(files);

      try {
        // Check for existing users by type
        let existingUser;
        switch (type) {
          case '1': // System Admin
            existingUser = await prisma.systemAdmin.findFirst({ where: { OR: [{ email }, { userName }, { phone }] } });
            break;
          case '2': // Police Head
            existingUser = await prisma.policeHead.findFirst({ where: { OR: [{ email }, { userName }, { phone }] } });
            break;
          case '3': // Inspector
            existingUser = await prisma.inspector.findFirst({ where: { OR: [{ email }, { userName }, { phone }] } });
            break;
          case '4': // Sajen
            existingUser = await prisma.sajen.findFirst({ where: { OR: [{ email }, { userName }, { phone }] } });
            break;
          case '6': // Prosecutor
            existingUser = await prisma.prosecutor.findFirst({ where: { OR: [{ email }, { userName }, { phone }] } });
            break;
          case '5': // Desk Officer
            existingUser = await prisma.deskOfficer.findFirst({ where: { OR: [{ email }, { userName }, { phone }] } });
            break;
          default:
            return res.status(400).json({ error: 'Invalid user type' });
        }

        // Check for conflicting user information
        if (existingUser) {
          if (existingUser.email === email) {
            return res.status(409).json({ error: 'Email is already in use' });
          }
          if (existingUser.userName === userName) {
            return res.status(409).json({ error: 'Username is already in use' });
          }
          if (existingUser.phone === phone) {
            return res.status(409).json({ error: 'Phone number is already in use' });
          }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        let newUser;
        switch (type) {
          case '1': // System Admin
            newUser = await prisma.systemAdmin.create({
              data: { firstName, lastName, email, phone, password: hashedPassword, userName, 
                kebeleIdPictureFront: kebeleIdPathFront,kebeleIdPictureBack: kebeleIdPathBack,
                 profilePicture: profilePicturePath },
            });
            break;
          case '2': // Police Head
            newUser = await prisma.policeHead.create({
              data: { firstName, lastName, email, phone, password: hashedPassword, userName,
                 kebeleIdPictureFront: kebeleIdPathFront,kebeleIdPictureBack: kebeleIdPathBack, 
                 profilePicture: profilePicturePath },
            });
            break;
          case '3': // Inspector
            newUser = await prisma.inspector.create({
              data: { firstName, lastName, email, phone, password: hashedPassword, userName, 
                kebeleIdPictureFront: kebeleIdPathFront,kebeleIdPictureBack: kebeleIdPathBack, 
                profilePicture: profilePicturePath },
            });
            break;
          case '4': // Sajen
            newUser = await prisma.sajen.create({
              data: { firstName, lastName, email, phone, password: hashedPassword, userName, 
                kebeleIdPictureFront: kebeleIdPathFront,kebeleIdPictureBack: kebeleIdPathBack, 
                profilePicture: profilePicturePath },
            });
            break;
          case '6': // Prosecutor
            newUser = await prisma.prosecutor.create({
              data: { firstName, lastName, email, phone, password: hashedPassword, userName, 
                kebeleIdPictureFront: kebeleIdPathFront,kebeleIdPictureBack: kebeleIdPathBack, 
                profilePicture: profilePicturePath },
            });
            break;
          case '5': // Desk Officer
            newUser = await prisma.deskOfficer.create({
              data: {firstName, lastName, email, phone, password: hashedPassword, userName,
                kebeleIdPictureFront: kebeleIdPathFront,kebeleIdPictureBack: kebeleIdPathBack, 
                profilePicture: profilePicturePath }
            });
            break;
          default:
            return res.status(400).json({ error: 'Invalid user type' });
        }

        res.status(201).json({ message: 'User registration successful', data: newUser });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: `Internal Server Error ${error}` });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
