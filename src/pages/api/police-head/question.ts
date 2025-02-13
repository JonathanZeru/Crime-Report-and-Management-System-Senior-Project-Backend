import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { caseId, inspectorId, policeHeadId, content } = req.body;
  
      if (!caseId || !inspectorId || !policeHeadId || !content) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      try {
        // Create a new question
        const question = await prisma.policeHeadQuestionToInspector.create({
          data: {
            caseId,
            inspectorId,
            policeHeadId,
            content,
          },
        });
  
        res.status(201).json({ message: 'Question created successfully', question });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create question' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  