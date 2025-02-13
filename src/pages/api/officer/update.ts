import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight request
    return res.status(204).end();
  }

  if (req.method === 'PUT') {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      // Extracting fields
      const { userId, userRoleId } = req.query; // Assuming the user ID and role are passed as query parameters
      console.log(userId, userRoleId)
      const firstName = Array.isArray(fields.firstName) ? fields.firstName[0] : fields.firstName;
      const lastName = Array.isArray(fields.lastName) ? fields.lastName[0] : fields.lastName;
      const profilePictureFile = files.profilePicture;
      const kebeleIdFileFront = files.kebeleIdPictureFront;
      const kebeleIdFileBack = files.kebeleIdPictureBack;

      // Log the parsed form data
      console.log('Parsed form data:', { fields, files });

      // Function to move file
      const moveFile = (file: File, dir: string) => {
        const newFilePath = path.join(dir, file.newFilename || 'default.png');
        fs.renameSync(file.filepath, newFilePath);
        return `/uploads/${file.newFilename || 'default.png'}`;
      };

      // Validation
      if (!userId || !userRoleId) {
        return res.status(400).json({ error: 'User ID and role are required' });
      }

      try {
        // Determine the role and find the user by ID
        let user;
        switch (userRoleId) {
          case '2': // Police Head
            user = await prisma.policeHead.findUnique({ where: { id: Number(userId) } });
            break;
          case '3': // Inspector
            user = await prisma.inspector.findUnique({ where: { id: Number(userId) } });
            break;
          case '4': // Sajen
            user = await prisma.sajen.findUnique({ where: { id: Number(userId) } });
            break;
          case '6': // Prosecutor
            user = await prisma.prosecutor.findUnique({ where: { id: Number(userId) } });
            break;
          case '5': // Desk Officer
            user = await prisma.deskOfficer.findUnique({ where: { id: Number(userId) } });
            break;
          default:
            return res.status(400).json({ error: 'Invalid user type' });
        }

        // Log user found
        console.log('Found user:', user);

        // Prepare the update data
        const updatedData: any = {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
        };

        // Log update data
        console.log('Updated data:', updatedData);

        // Update files if provided
        if (kebeleIdFileFront) {
          const uploadDir = path.join(process.cwd(), '/public/uploads/');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          updatedData.kebeleIdPictureFront = moveFile(Array.isArray(kebeleIdFileFront) ? kebeleIdFileFront[0] : kebeleIdFileFront, uploadDir);
        }

        if (kebeleIdFileBack) {
          const uploadDir = path.join(process.cwd(), '/public/uploads/');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          updatedData.kebeleIdPictureBack = moveFile(Array.isArray(kebeleIdFileBack) ? kebeleIdFileBack[0] : kebeleIdFileBack, uploadDir);
        }

        if (profilePictureFile) {
          const uploadDir = path.join(process.cwd(), '/public/uploads/');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          updatedData.profilePicture = moveFile(Array.isArray(profilePictureFile) ? profilePictureFile[0] : profilePictureFile, uploadDir);
        }

        // Perform the update based on role and ID
        let updatedUser;
        switch (userRoleId) {
          case "2": // Police Head
            updatedUser = await prisma.policeHead.update({
              where: { id: Number(userId) },
              data: updatedData,
            });
            break;
          case '3': // Inspector
            updatedUser = await prisma.inspector.update({
              where: { id: Number(userId) },
              data: updatedData,
            });
            break;
          case '4': // Sajen
            updatedUser = await prisma.sajen.update({
              where: { id: Number(userId) },
              data: updatedData,
            });
            break;
          case '6': // Prosecutor
            updatedUser = await prisma.prosecutor.update({
              where: { id: Number(userId) },
              data: updatedData,
            });
            break;
          case '5': // Desk Officer
            updatedUser = await prisma.deskOfficer.update({
              where: { id: Number(userId) },
              data: updatedData,
            });
            break;
          default:
            return res.status(400).json({ error: 'Invalid user type' });
        }
        console.log(updatedUser)
        res.status(200).json({ message: 'User updated successfully', data: updatedUser });
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: `Internal Server Error ${error}` });
      }
    });
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
