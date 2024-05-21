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
