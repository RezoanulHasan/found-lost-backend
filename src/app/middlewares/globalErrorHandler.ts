/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import handleValidationError from '../../errors/handleValidationError';

import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import handleClientError from '../../errors/handleClientError';
import handleZodError from '../../errors/handleZodError';
import { IGenericErrorMessage } from '../../interface/error';

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  config.env === 'development'
    ? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
    : console.log(`🐱‍🏍 globalErrorHandler ~~`, { error });

  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorDetails: IGenericErrorMessage[] = [];
  if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails.issues;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorDetails = error?.message
      ? [
          {
            field: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorDetails = error?.message
      ? [
          {
            field: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    stack: config.env !== 'development' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
