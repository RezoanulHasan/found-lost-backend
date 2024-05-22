/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import catchAsync from '../../../shared/cathAsync';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();
export const reportLostItem: RequestHandler = catchAsync(async (req, res) => {
  const {
    category,
    lostItemName,
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

    const lostItem = await prisma.lostItem.create({
      data: {
        userId,
        category,
        lostItemName,
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
      message: 'Lost item reported successfully',
      data: lostItem,
    });
  } catch (error) {
    console.error('Error reporting lost item:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});

export const getLostItemById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const lostItem = await prisma.lostItem.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Lost item not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: lostItem,
    });
  } catch (error) {
    console.error('Error retrieving lost item:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});

export const updateLostItemById: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const {
      category,
      lostItemName,
      description,
      location,
      date,
      image,
      phoneNumber,
      email,
      status,
    } = req.body;

    try {
      const lostItem = await prisma.lostItem.findUnique({
        where: { id },
      });

      if (!lostItem) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Lost item not found',
        });
      }

      const updatedLostItem = await prisma.lostItem.update({
        where: { id },
        data: {
          category,
          lostItemName,
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
        message: 'Lost item updated successfully',
        data: updatedLostItem,
      });
    } catch (error) {
      console.error('Error updating lost item:', error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  },
);

export const deleteLostItemById: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    try {
      const lostItem = await prisma.lostItem.findUnique({
        where: { id },
      });

      if (!lostItem) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Lost item not found',
        });
      }

      await prisma.lostItem.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Lost item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting lost item:', error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  },
);

//get  lost items  by all
interface QueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  lostItemName?: string;
  location?: string;
  description?: string;
  category?: string;
  date?: string;
}

export const getLostItemsByUser: RequestHandler = catchAsync(
  async (req, res) => {
    const {
      searchTerm,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      lostItemName,
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
          { lostItemName: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      };
    }

    if (lostItemName) {
      filterOptions.where.lostItemName = {
        contains: lostItemName,
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

    filterOptions.where.userId = userId; // Add userId to filter options

    const lostItems = await prisma.lostItem.findMany({
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

    const total = await prisma.lostItem.count({
      where: { userId, ...filterOptions.where }, // Count lost items for the specific user
    });

    // Remove userId field from each lost item
    const sanitizedLostItems = lostItems.map(item => {
      const { userId, ...sanitizedItem } = item;
      return sanitizedItem;
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Lost items retrieved successfully',
      meta: {
        total,
        page: parseInt(page.toString()),
        limit: parseInt(limit.toString()),
      },
      data: sanitizedLostItems,
    });
  },
);

export const getLostItems: RequestHandler = catchAsync(async (req, res) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
    lostItemName,
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
        { lostItemName: { contains: searchTerm, mode: 'insensitive' } },
        { location: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };
  }

  if (lostItemName) {
    filterOptions.where.lostItemName = {
      contains: lostItemName,
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

  const lostItems = await prisma.lostItem.findMany({
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

  const total = await prisma.lostItem.count({
    where: filterOptions.where,
  });

  // Remove userId field from each lost item
  const sanitizedLostItems = lostItems.map(item => {
    const { ...sanitizedItem } = item;
    return sanitizedItem;
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Lost items retrieved successfully',
    meta: {
      total,
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
    },

    data: sanitizedLostItems,
  });
});
