import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight request
    return res.status(204).end();
  }

  // Update password (PUT method)
  if (req.method === 'PUT') {
    const { userId, roleId } = req.query;  // User ID and Role ID from URL parameters or body
    const { oldPassword, newPassword } = req.body;

    if (!userId || !roleId || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'User ID, role ID, old password, and new password are required' });
    }

    try {
      // Find the user by their ID and roleId
      let user;
      switch (roleId) {
        
        case '2': // Police Head
          user = await prisma.policeHead.findUnique({ where: { id: Number(userId) } });
          break;
        case '3': // Inspector
          user = await prisma.inspector.findUnique({ where: { id: Number(userId) } });
          break;
        case '4': // Sajen
          user = await prisma.sajen.findUnique({ where: { id: Number(userId) } });
          break;
        case '5': // Desk Officer
          user = await prisma.deskOfficer.findUnique({ where: { id: Number(userId) } });
          break;
        case '6': // Prosecutor
          user = await prisma.prosecutor.findUnique({ where: { id: Number(userId) } });
          break;
        default:
          return res.status(400).json({ error: 'Invalid user role' });
      }

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare old password with stored hash
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return res.status(400).json({ error: 'Old password is incorrect' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the password
      let updatedUser;
      switch (roleId) {
        
        case '2': // Police Head
          updatedUser = await prisma.policeHead.update({
            where: { id: Number(userId) },
            data: { password: hashedNewPassword },
          });
          break;
        case '3': // Inspector
          updatedUser = await prisma.inspector.update({
            where: { id: Number(userId) },
            data: { password: hashedNewPassword },
          });
          break;
        case '4': // Sajen
          updatedUser = await prisma.sajen.update({
            where: { id: Number(userId) },
            data: { password: hashedNewPassword },
          });
          break;
        case '5': // Desk Officer
          updatedUser = await prisma.deskOfficer.update({
            where: { id: Number(userId) },
            data: { password: hashedNewPassword },
          });
          break;
        case '6': // Prosecutor
          updatedUser = await prisma.prosecutor.update({
            where: { id: Number(userId) },
            data: { password: hashedNewPassword },
          });
          break;
        default:
          return res.status(400).json({ error: 'Invalid user role' });
      }

      res.status(200).json({ message: 'Password updated successfully', data: updatedUser });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: `Internal Server Error ${error}` });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
