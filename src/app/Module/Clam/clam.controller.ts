/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client';

import catchAsync from '../../../shared/cathAsync';
import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';

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
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
        },
      },
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

interface QueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  lostDate?: string;
}

export const getAllClaimsForUser: RequestHandler = catchAsync(
  async (req, res) => {
    const {
      searchTerm,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      lostDate,
    }: QueryParams = req.query;

    const filterOptions: any = {
      skip: (parseInt(page.toString()) - 1) * parseInt(limit.toString()),
      take: parseInt(limit.toString()),
      orderBy: {
        [sortBy || 'createdAt']: sortOrder || 'desc',
      },
      where: {},
    };

    if (searchTerm) {
      filterOptions.where = {
        OR: [{ lostDate: { contains: searchTerm, mode: ' lostDate' } }],
      };
    }

    if (lostDate) {
      filterOptions.where.lostDate = {
        contains: lostDate,
        mode: 'insensitive',
      };
    }

    const user = req.user as JwtPayload;
    const { userId } = user;

    filterOptions.where.userId = userId; //
    const claims = await prisma.claim.findMany({
      ...filterOptions,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const total = await prisma.claim.count({
      where: { userId, ...filterOptions.where },
    });

    // Remove userId and categoryId fields from each found item
    const sanitizedFoundItems = claims?.map(item => {
      const { userId, ...sanitizedItem } = item;
      return sanitizedItem;
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Found items retrieved successfully',
      meta: {
        total,
        page: parseInt(page.toString()),
        limit: parseInt(limit.toString()),
      },
      data: sanitizedFoundItems,
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
