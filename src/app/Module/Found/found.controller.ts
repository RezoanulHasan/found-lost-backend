/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import catchAsync from '../../../shared/cathAsync';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

export const reportFoundItem: RequestHandler = catchAsync(async (req, res) => {
  const {
    category,
    foundItemName,
    description,
    location,
    date,
    image,
    phoneNumber,
    email,
  } = req.body;

  try {
    const user = req.user as JwtPayload;

    if (!user || !user.userId) {
      throw new Error('User information not available');
    }

    const { userId } = user;

    const foundItem = await prisma.foundItem.create({
      data: {
        userId,
        category,
        foundItemName,
        description,
        location,
        date,
        image,
        phoneNumber,
        email,
      },
      include: {
        user: true,
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
          phoneNumber: foundItem.user.phoneNumber || '',
          createdAt: foundItem.user.createdAt || '',
          updatedAt: foundItem.user.updatedAt || '',
        },
        category: foundItem.category, // category is now directly included
        foundItemName: foundItem.foundItemName,
        description: foundItem.description,
        location: foundItem.location,
        date: foundItem.date,
        image: foundItem.image,
        phoneNumber: foundItem.phoneNumber,
        email: foundItem.email,
        status: foundItem.status,
        createdAt: foundItem.createdAt,
        updatedAt: foundItem.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error reporting found item:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});

export const getFoundItemById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const foundItem = await prisma.foundItem.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Found item not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: foundItem,
    });
  } catch (error) {
    console.error('Error retrieving found item:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});

export const deleteFoundItemById: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    try {
      const foundItem = await prisma.foundItem.findUnique({
        where: { id },
      });

      if (!foundItem) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Found item not found',
        });
      }

      await prisma.foundItem.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Found item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting found item:', error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  },
);

export const updateFoundItemById: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const {
      category,
      foundItemName,
      description,
      location,
      date,
      image,
      phoneNumber,
      email,
      status,
    } = req.body;

    try {
      const foundItem = await prisma.foundItem.findUnique({
        where: { id },
      });

      if (!foundItem) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Found item not found',
        });
      }

      const updatedFoundItem = await prisma.foundItem.update({
        where: { id },
        data: {
          category,
          foundItemName,
          description,
          location,
          date,
          image,
          phoneNumber,
          email,
          status,
        },
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Found item updated successfully',
        data: updatedFoundItem,
      });
    } catch (error) {
      console.error('Error updating found item:', error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  },
);

interface QueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  foundItemName?: string;
  location?: string;
  description?: string;
  category?: string;
  date?: string;
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
    category,
    date,
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

  if (category) {
    filterOptions.where.category = { equals: category };
  }

  if (date) {
    filterOptions.where.date = { equals: date };
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
          phoneNumber: true,
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
});

export const getFoundItemsByUser: RequestHandler = catchAsync(
  async (req, res) => {
    const {
      searchTerm,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      foundItemName,
      location,
      description,
      category,
      date,
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
      filterOptions.where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (description) {
      filterOptions.where.description = {
        contains: description,
        mode: 'insensitive',
      };
    }

    if (category) {
      filterOptions.where.category = { equals: category };
    }

    if (date) {
      filterOptions.where.date = { equals: date };
    }
    const user = req.user as JwtPayload;
    const { userId } = user;

    filterOptions.where.userId = userId; //
    const foundItems = await prisma.foundItem.findMany({
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

    const total = await prisma.foundItem.count({
      where: { userId, ...filterOptions.where },
    });

    // Remove userId and categoryId fields from each found item
    const sanitizedFoundItems = foundItems.map(item => {
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
