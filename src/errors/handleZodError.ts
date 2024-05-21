import { ZodError, ZodIssue } from 'zod';
import {
  IGenericZodErrorResponse,
  IGenericErrorMessage,
} from '../interface/error';

const handleZodError = (error: ZodError): IGenericZodErrorResponse => {
  const validationErrors: IGenericErrorMessage[] = error.errors.map(
    (err: ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }),
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorDetails: {
      issues: validationErrors,
    },
  };
};

export default handleZodError;
