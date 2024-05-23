import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import { getAllClaimsForUser } from './clam.controller';

const router = express.Router();

router.get(
  '/claim',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),
  getAllClaimsForUser,
);
export const ClamItemByUserRoutes = router;
