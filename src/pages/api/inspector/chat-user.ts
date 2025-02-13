import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable, { IncomingForm, File } from 'formidable';

// Initialize Prisma Client
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
    console.log("here 1")
    const form = new IncomingForm({ keepExtensions: true });
    console.log("here 2")
  
      form.parse(req, async (err, fields, files) => {
        console.log("here 4")
        if (err) {
          console.error('Error parsing form data:', err);
          return res.status(500).json({ error: 'Failed to process form data' });
        }
        // Extract form data
        const caseId = Array.isArray(fields.caseId) ? fields.caseId[0] : fields.caseId;
        const inspectorId = Array.isArray(fields.inspectorId) ? fields.inspectorId[0] : fields.inspectorId;
        const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
        const content = Array.isArray(fields.content) ? fields.content[0] : fields.content;
        console.log({ caseId, userId, inspectorId, content } )
        if (!caseId || !userId || !userId || !content) {
          return res.status(400).json({ error: 'All fields are required' });
        }
       
    
        try {
          // Create a new question
          const question = await prisma.inspectorQuestionToUser.create({
            data: {
              caseId: parseInt(caseId),
              inspectorId: parseInt(inspectorId),
              userId: parseInt(userId),
              content,
              senderName:"Inspector",
              receiverName:"User"
            }
          });
    
          res.status(201).json({ message: 'Question created successfully', question });
        } catch (error) {
          res.status(500).json({ error: 'Failed to create question' });
        }
        })
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  