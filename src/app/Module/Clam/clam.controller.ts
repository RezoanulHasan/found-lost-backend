/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/cathAsync';
import { RequestHandler } from 'express';

const prisma = new PrismaClient();

export const createClaim: RequestHandler = catchAsync(async (req, res) => {
  const { foundItemId, distinguishingFeatures, lostDate } = req.body;

  const user = req.user as JwtPayload; // Corrected to use req.user instead of req.body.user
  if (!user || !user.userId) {
    throw new Error('User information not available');
  }
  const { userId } = user;

  const claim = await prisma.claim.create({
    data: {
      userId,
      foundItemId,
      distinguishingFeatures,
      lostDate,
    },
  });
  const foundItem = await prisma.foundItem.findUnique({
    where: { id: foundItemId },
  });

  if (!foundItem) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'Found item not found',
    });
  }
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Claim created successfully',
    data: claim,
  });
});

export const getClaimById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const claim = await prisma.claim.findUnique({
    where: { id },
    include: {
      foundItem: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              // Note: `password`, `status`, and `needPasswordChange` fields are explicitly excluded
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  if (!claim) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'Claim not found',
    });
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Claim retrieved successfully',
    data: claim,
  });
});

export const deleteClaimById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const claim = await prisma.claim.findUnique({
    where: { id },
  });

  if (!claim) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'Claim not found',
    });
  }

  await prisma.claim.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Claim deleted successfully',
  });
});

export const getAllClaims: RequestHandler = catchAsync(async (req, res) => {
  const claims = await prisma.claim.findMany({
    include: {
      foundItem: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              password: false,
              status: false,
              needPasswordChange: false,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Claims retrieved successfully',
    data: claims,
  });
});

export const getAllClaimsForUser: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;

    const claims = await prisma.claim.findMany({
      where: {
        userId: userId,
      },
      include: {
        foundItem: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Claims retrieved successfully',
      data: claims,
    });
  },
);

export const updateClaimStatus: RequestHandler = catchAsync(
  async (req, res) => {
    const Id = req.params.id;

    // Check if the provided ID is valid
    const existingClaim = await prisma.claim.findUnique({
      where: { id: Id },
    });

    if (!existingClaim) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No claim found with the provided ID',
      });
    }

    const { status } = req.body;
    // Check if the status is valid
    if (
      !status ||
      (status !== 'APPROVED' && status !== 'PENDING' && status !== 'REJECTED')
    ) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid status provided',
      });
    }

    const updatedClaim = await prisma.claim.update({
      where: { id: Id },
      data: { status },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Claim updated successfully',
      data: updatedClaim,
    });
  },
);
