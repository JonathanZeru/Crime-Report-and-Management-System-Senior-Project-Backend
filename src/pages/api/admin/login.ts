import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

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
    const { userName, password, role } = req.body;
    console.log({ userName, password, role })
    try {
      let user

      switch (role) {
        case '1': // System Admin
          user = await prisma.systemAdmin.findUnique({
            where: { userName: userName },
          });
          break;
        case '2': // Police Head
          user = await prisma.policeHead.findUnique({
            where: { userName: userName },
          });
          break;
        case '3': // Inspector
          user = await prisma.inspector.findUnique({
            where: { userName: userName },
          });
          break;
        case '4': // Sajen
          user = await prisma.sajen.findUnique({
            where: { userName: userName },
          });
          break;
          case '5': // Desk Officer
            user = await prisma.deskOfficer.findUnique({
              where: { userName: userName },
            });
            break;
        case '6': // Prosecutor
          user = await prisma.prosecutor.findUnique({
            where: { userName: userName },
          });
          break;
        default:
          return res.status(400).json({ error: 'Invalid role selected' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, userName: user.userName, email: user.email, role: role },
        SECRET_KEY,
        { expiresIn: '30d' }
      );

      // Remove the password before sending the response
      const { password: _, ...userWithoutPassword } = user;
      let userRoleId = role
      console.log({
        message: 'Login successful',
        data: userWithoutPassword,
        accessToken: token,
        userRoleId: userRoleId
      })
      res.status(200).json({
        message: 'Login successful',
        data: userWithoutPassword,
        accessToken: token,
        userRoleId: userRoleId
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
