import express from 'express';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser,
);
export const LoginRoutes = router;
