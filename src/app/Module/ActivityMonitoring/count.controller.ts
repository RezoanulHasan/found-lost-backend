import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import catchAsync from '../../../shared/cathAsync';

const prisma = new PrismaClient(); // Function to get the counts

export const getCounts: RequestHandler = catchAsync(async (req, res) => {
  const userCount = await prisma.user.count();
  const claimCount = await prisma.claim.count();
  const lostItemCount = await prisma.lostItem.count();
  const foundItemCount = await prisma.foundItem.count();

  const counts = {
    users: userCount,
    claims: claimCount,
    lostItems: lostItemCount,
    foundItems: foundItemCount,
  };

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Counts retrieved successfully',
    data: counts,
  });
});
