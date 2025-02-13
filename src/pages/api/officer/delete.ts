import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    // Extract ID and type from query parameters
    const { id, type } = req.query;

    if (!id || !type || typeof id !== 'string' || typeof type !== 'string') {
      return res.status(400).json({ error: 'ID and type are required' });
    }

    const userId = parseInt(id);

    try {
      // Delete user based on type
      switch (type) {
        case '1':
          await prisma.policeHead.delete({
            where: { id: userId },
          });
          break;
        case '2':
          await prisma.inspector.delete({
            where: { id: userId },
          });
          break;
        case '3':
          await prisma.sajen.delete({
            where: { id: userId },
          });
          break;
        case '4':
          await prisma.prosecutor.delete({
            where: { id: userId },
          });
          break;
        case '5':
          await prisma.deskOfficer.delete({
            where: { id: userId },
          });
          break;
        default:
          return res.status(400).json({ error: 'Invalid user type' });
      }

      res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
