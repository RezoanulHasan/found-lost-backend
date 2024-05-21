/* eslint-disable no-undef */
import { Prisma } from '@prisma/client'; // Importing Prisma for types

import { IGenericErrorResponse } from '../interface/error'; // Importing a custom interface for error response

const handleValidationError = (
  error: Prisma.PrismaClientValidationError, // Prisma validation error
): IGenericErrorResponse => {
  // Defining the return type as IGenericErrorResponse
  const errors = [
    // Array to hold the error details
    {
      field: '', // Field which caused the validation error (Here, originalUrl of the request)
      message: error.message, // Error message
    },
  ];
  const statusCode = 400; // Setting status code to 400 for validation errors
  return {
    statusCode, // Returning status code
    message: 'Validation Error', // Error message
    errorDetails: errors, // Details of the validation errors
  };
};

export default handleValidationError; // Exporting the handleValidationError function
