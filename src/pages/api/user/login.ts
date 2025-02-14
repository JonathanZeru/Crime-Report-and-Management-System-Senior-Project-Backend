import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || '';

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
    const { userName, password } = req.body;
    try {
      // Find user by username
      const user = await prisma.user.findUnique({
        where: { userName },
      });

      if (!user) {
        return res.status(404).json({ error: 'Invalid username or password' });
      }

      if (!user.isActive) {
        console.log(user.isActive)
        return res.status(403).json({
          error: 'This account has been deleted or is inactive.',
        });
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, userName: user.userName, email: user.email },
        SECRET_KEY,
        { expiresIn: '30d' } // Token will expire in 30 days
      );

      // Omit password from the response
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'Login successful',
        data: userWithoutPassword,
        accessToken: token,
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
