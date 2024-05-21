/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
//import superAdminRoutes from './app/superAdmin/superAdminRoutes';

const app: Application = express();

//parsers
//app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//app.use(  https://dd-two-beta.vercel.app
///cors({
///origin: ['http://localhost:3000', 'http://localhost:3001'],
/// credentials: true,
// }),
//);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

//route
app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.json({ message: ' System Sever is running  ' });
});
// Global error handler
app.use(globalErrorHandler);
//Not Found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API NOT FOUND!',
    errorDetails: {
      path: req.originalUrl,
      message: 'Your requested path is not found!',
    },
  });
});

export default app;
