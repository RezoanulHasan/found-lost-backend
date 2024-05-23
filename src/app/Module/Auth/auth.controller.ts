/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */ import {
  Request,
  RequestHandler,
  Response,
} from 'express';
import config from '../../../config';
import sendResponse from '../../../shared/sendResponse';
import { IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';
import catchAsync from '../../../shared/cathAsync';

import { User } from '../../zodValadiation/zodValadiation';
import { errorMessages, hashedPassword } from '../../../helper/PasswordHelpers';
import prisma from '../../../shared/prisma';

export const registration: RequestHandler = catchAsync(async (req, res) => {
  const validatedData = User.parse(req.body);
  const { name, email, password, profile, role, userImage, phoneNumber } =
    validatedData;

  // Check if the username already exists
  const existingUser = await prisma.user.findUnique({
    where: { name },
  });
  if (existingUser) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errorMessages.usernameExists,
    });
  }

  // Check if the email already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errorMessages.emailExists,
    });
  }

  // Check password criteria
  if (password.length < 6) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errorMessages.passwordLength,
    });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errorMessages.passwordUppercase,
    });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errorMessages.passwordLowercase,
    });
  }

  // Check if username starts with an uppercase letter
  if (!/^[A-Z]/.test(name)) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errorMessages.usernameUppercase,
    });
  }

  // Hash the password
  const hashedPasswordValue = await hashedPassword(password);

  // Create user and associated profile in the database
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      role,
      userImage,
      phoneNumber,
      password: hashedPasswordValue,
      profile: {
        create: profile, // Assuming profile data is provided in the request body
      },
    },
    include: {
      profile: true, // Include the profile data in the response
    },
  });

  // Omit the password from the user data
  const { password: _, ...userData } = createdUser;

  // Respond with success
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'User registered successfully',
    data: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      userImage: userData.userImage,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      profile: userData.profile, // This assumes profile is included in the returned user object
    },
  });
});

//....................................../login......................

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
  });

  const data = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    userImage: result.user.userImage,
    token: result.accessToken,
  };

  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'User Logged in successfully!',
    data: data,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie
  //if fronted ok--  then  off this section ..other wise  uncomment this

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully !',
    data: undefined,
  });
});

const forgotPass = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPass(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check your email!',
    data: undefined,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  await AuthService.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account recovered!',
    data: undefined,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword,
};
