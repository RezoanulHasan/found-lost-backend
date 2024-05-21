/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import prisma from '../../../shared/prisma';

import { paginationHelpers } from '../../../helper/paginationHelpers';
import catchAsync from '../../../shared/cathAsync';
import { Prisma } from '@prisma/client';

//.............................................deleteUser.......................................................

export const deleteALLTime = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;

    // Fetch user and user profile before deletion
    const deletedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    const deletedProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    // Start a transaction
    await prisma.$transaction([
      // Delete the user profile
      prisma.userProfile.delete({
        where: { userId },
      }),
      // Delete the user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'User and associated profile deleted successfully',
      deletedUser,
      deletedProfile,
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

//..............................................getAllUsers search team  and pagination......................................................

export const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const { page, limit, sortBy, sortOrder, searchTerm } = req.query;

  // Define filter options
  const filterOptions: Prisma.UserWhereInput = {};
  if (typeof searchTerm === 'string') {
    filterOptions.OR = [
      {
        name: {
          contains: searchTerm,
          mode: 'insensitive', // Case insensitive search
        },
      },
      {
        email: {
          contains: searchTerm,
          mode: 'insensitive', // Case insensitive search
        },
      },
    ];
  }

  // Calculate pagination options
  const paginationOptions = paginationHelpers.calculatePagination({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy ? String(sortBy) : undefined,
    sortOrder: sortOrder ? String(sortOrder) : undefined,
  });

  // Fetch users with pagination and filtering, excluding the password field
  const users = await prisma.user.findMany({
    take: paginationOptions.limit,
    skip: paginationOptions.skip,
    orderBy: {
      [paginationOptions.sortBy]: paginationOptions.sortOrder,
    },
    where: filterOptions,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      userImage: true,
      password: false,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Fetch total count of users with filtering
  const totalUsersCount = await prisma.user.count({
    where: filterOptions,
  });

  // Construct response
  const response = {
    statusCode: 200,
    success: true,
    message: 'Successfully retrieved users with pagination',
    meta: {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      total: totalUsersCount,
    },
    users,
  };

  res.status(200).json(response);
});

//.............................................. getUserById:......................................................
export const getUserById: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.params.id; // Extract user ID from request parameters
  // Retrieve user by ID from the database, excluding the password field
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      userImage: true,
      role: true,

      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    user,
  });
});

//.............................................. update......................................................
export const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const { email, password, role, name, profile } = req.body;

  try {
    // Start a transaction
    await prisma.$transaction([
      // Update the user
      prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          password,
          role,
        },
      }),

      // Update the user profile
      prisma.userProfile.update({
        where: { userId },
        data: {
          ...profile,
        },
      }),
    ]);

    // Fetch updated user and profile after the transaction
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    const updatedProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'User and associated profile updated successfully',
      updatedUser,
      updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: 'Internal server error',
    });
  }
});
