/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import catchAsync from '../../../shared/cathAsync';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

export const createFoundItemCategory: RequestHandler = catchAsync(
  async (req, res) => {
    const { name } = req.body;
    const foundItemCategory = await prisma.foundItemCategory.create({
      data: {
        name,
      },
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Found item category created successfully',
      data: foundItemCategory,
    });
  },
);

export const reportFoundItem: RequestHandler = catchAsync(async (req, res) => {
  const { categoryId, foundItemName, description, location } = req.body;

  try {
    const user = req.user as JwtPayload; // Corrected to use req.user instead of req.body.user

    if (!user || !user.userId) {
      throw new Error('User information not available');
    }

    const { userId } = user;

    const foundItem = await prisma.foundItem.create({
      data: {
        userId, // Corrected to use userId instead of user
        categoryId,
        foundItemName,
        description,
        location,
      },
      include: {
        user: true,
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Found item reported successfully',
      data: {
        id: foundItem.id,
        userId,
        user: {
          id: foundItem.user.id,
          name: foundItem.user.name || '',
          email: foundItem.user.email || '',
          createdAt: foundItem.createdAt || '',
          updatedAt: foundItem.updatedAt || '',
        },
        categoryId,
        category: {
          id: foundItem.category.id,
          name: foundItem.category.name,
          createdAt: foundItem.createdAt,
          updatedAt: foundItem.updatedAt,
        },
        foundItemName: foundItem.foundItemName,
        description: foundItem.description,
        location: foundItem.location,
        createdAt: foundItem.createdAt,
        updatedAt: foundItem.updatedAt,
      },
    });
  } catch (error) {
    // console.error('Error reporting found item:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});

interface QueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  foundItemName?: string;
  location?: string;
  description?: string;
}

export const getFoundItems: RequestHandler = catchAsync(async (req, res) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
    foundItemName,
    location,
    description,
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
      OR: [
        { foundItemName: { contains: searchTerm, mode: 'insensitive' } },
        { location: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };
  }

  if (foundItemName) {
    filterOptions.where.foundItemName = {
      contains: foundItemName,
      mode: 'insensitive',
    };
  }
  if (location) {
    filterOptions.where.location = { contains: location, mode: 'insensitive' };
  }
  if (description) {
    filterOptions.where.description = {
      contains: description,
      mode: 'insensitive',
    };
  }

  const foundItems = await prisma.foundItem.findMany({
    ...filterOptions,
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
      category: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const total = await prisma.foundItem.count({
    where: filterOptions.where,
  });

  // Remove userId and categoryId fields from each found item
  const sanitizedFoundItems = foundItems.map(item => {
    const { userId, categoryId, ...sanitizedItem } = item;
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
});
