/* eslint-disable @typescript-eslint/no-explicit-any */
export type IGenericErrorMessage = {
  field: string | number;
  message: string;
};
export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorDetails: IGenericErrorMessage[];
};

export type IGenericZodErrorResponse = {
  statusCode: number;
  message: string;
  errorDetails: {
    issues: IGenericErrorMessage[];
  };
};
