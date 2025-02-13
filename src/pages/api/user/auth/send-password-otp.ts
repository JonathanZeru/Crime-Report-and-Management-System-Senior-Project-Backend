// pages/api/sendOtp.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email,otp } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "jonathanzeru21@gmail.com",
        pass: "isek dnxp xkms iiha", // Replace with your actual app password
      },
    });

    const mailOptions = {
      from: "jonathanzeru21@gmail.com",
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>You have requested to reset your password, since you have forgotten your password.</h2>
          <p>Use the following OTP code to verify your email address:</p>
          <h1 style="color: #4A90E2;">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
}
