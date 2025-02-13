import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend origin

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    try {
      // Count users, police heads, sajens, inspectors, prosecutors
      const [totalUsers, totalPoliceHeads, totalSajens, totalInspectors, totalProsecutors] = await Promise.all([
        prisma.user.count(),
        prisma.policeHead.count(),
        prisma.sajen.count(),
        prisma.inspector.count(),
        prisma.prosecutor.count(),
      ]);

      const cases = {
        Assigned: 0,
        'Under Investigation': 0,
        Pending: 0,
        Solved: 0,
        'High Level': 0,
        'Medium Level': 0,
        'Low Level': 0,
      };

      // Aggregate case counts by status and case level
      const caseCounts = await prisma.case.groupBy({
        by: ['status', 'caseLevelOfCrime'],
        _count: {
          id: true, // Count the number of cases
        },
      });

      // Process the counts
      caseCounts.forEach((caseEntry) => {
        // Increment counts based on status
        if (caseEntry.status in cases) {
          cases[caseEntry.status] += caseEntry._count.id;
        }

        // Increment counts based on case level
        if (caseEntry.caseLevelOfCrime) {
          let levelKey = '';
          if (caseEntry.caseLevelOfCrime === 'High Level') {
            levelKey = 'High Level';
          } else if (caseEntry.caseLevelOfCrime === 'Medium Level') {
            levelKey = 'Medium Level';
          } else if (caseEntry.caseLevelOfCrime === 'Low Level') {
            levelKey = 'Low Level';
          }

          // If the level key is valid, increment its count
          if (levelKey) {
            cases[levelKey] += caseEntry._count.id;
          }
        }
      });

      // Count cases reported per month
      const casesPerMonth = await prisma.case.groupBy({
        by: ['createdAt'],
        _count: {
          id: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Format monthly data for graphing
      const monthlyCases = casesPerMonth.map(month => ({
        month: month.createdAt.toISOString().slice(0, 7), // Format YYYY-MM
        count: month._count.id,
      }));

      // Return the aggregated data
      res.status(200).json({
        totalUsers,
        totalPoliceHeads,
        totalSajens,
        totalInspectors,
        totalProsecutors,
        cases,
        monthlyCases,
      });
      
    } catch (error) {
      console.error('Error retrieving statistics:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}