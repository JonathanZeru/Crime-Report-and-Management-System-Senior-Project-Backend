import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userName, password, type } = req.body;

    if (!userName || !password || !type) {
      return res.status(400).json({ error: 'Username, password, and type are required' });
    }

    try {
      // Find the user based on type and userName
      let user: any;
      switch (type) {
        case '1':
          user = await prisma.policeHead.findUnique({ where: { userName } });
          break;
        case '2':
          user = await prisma.inspector.findUnique({ where: { userName } });
          break;
        case '3':
          user = await prisma.sajen.findUnique({ where: { userName } });
          break;
        case '4':
          user = await prisma.prosecutor.findUnique({ where: { userName } });
          break;
        case '5':
          user = await prisma.deskOfficer.findUnique({ where: { userName } });
          break;
        default:
          return res.status(400).json({ error: 'Invalid user type' });
      }

      // Check if user exists
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id, type }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', accessToken: token, 
        data: user });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
