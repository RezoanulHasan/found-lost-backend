/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import catchAsync from '../../../shared/cathAsync';
import { JwtPayload } from 'jsonwebtoken';
import { RequestHandler } from 'express';

const prisma = new PrismaClient();

export const getMyProfile: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const { userId } = user;

  const userProfile = await prisma.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          userImage: true,
          password: false,
          status: false,
          needPasswordChange: false,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!userProfile) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'User profile not found',
    });
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Profile retrieved successfully',
    data: userProfile,
  });
});

export const updateMyProfile: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const { userId } = user;

  const { bio, age } = req.body;

  const updatedProfile = await prisma.userProfile.update({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          userImage: true,
          role: true,
          password: false,
          status: false,
          needPasswordChange: false,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    data: {
      bio,
      age,

      updatedAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User profile updated successfully',
    data: updatedProfile,
  });
});

export const updateMyProfileWithUser: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.user as JwtPayload;

    const userId = req.params.id;
    const { bio, age, name, email, userImage, role } = req.body;

    // Update User
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        userImage,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        userImage: true,
        role: true,
        status: true,
      },
    });

    // Update UserProfile
    const updatedProfile = await prisma.userProfile.update({
      where: {
        userId,
      },
      data: {
        bio,
        age,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User profile updated successfully',
      data: {
        user: updatedUser,
        userProfile: updatedProfile,
      },
    });
  },
);
