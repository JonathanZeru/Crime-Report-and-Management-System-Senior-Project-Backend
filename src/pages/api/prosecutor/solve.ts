import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';
const genAI = new GoogleGenerativeAI('AIzaSyC7S7olMKO6GU9s3U9kgBhI8RBSzmR9B94');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const analyzeCrimeSeverity = async (
    description: string,
    natureOfCrime: string,
    crimeDetail: string
  ) => {
    const prompt = `
    Analyze the following crime details:
    Description: ${description}
    Nature of Crime: ${natureOfCrime}
    Crime Details: ${crimeDetail}
  
    Based on the severity model:
    - High-Level Crimes: Severe consequences with significant harm.
    - Medium-Level Crimes: Serious but less severe than high-level.
    - Low-Level Crimes: Minor offenses with lesser penalties.
  
    Assign a severity level (High Level, Medium Level, or Low Level) and respond with one of these levels.`;
  
    try {
      const result = await model.generateContent(prompt);
      const responseText = result?.response?.text?.();
      console.log('Severity Analysis Result:', responseText?.trim());
      return responseText?.trim() || 'Unable to determine severity due to invalid response.';
    } catch (error) {
      console.error("Error during AI analysis:", error);
      return 'Unable to determine severity due to an AI error.';
    }
  };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method === 'POST') {

    const { id } = req.query;

    try {
      if (id || Array.isArray(id)) {

      const user = await prisma.case.update(
        {
        where: { id: Number(id) },
        data: {
            status: 'Solved'
        }}
      );

      if (!user) {
        return res.status(404).json({ error: 'case not found' });
      }

      res.status(200).json(user); 
    }else{
      const user = await prisma.case.findMany({
            orderBy: {
              createdAt: 'desc' // Adjust the field name based on your schema
            }
      });

      res.status(200).json(user); 
    }
    } catch (error) {
      console.error('Error retrieving case:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
