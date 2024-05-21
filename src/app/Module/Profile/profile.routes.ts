import express from 'express';

import {
  getMyProfile,
  // updateMyProfile,
  updateMyProfileWithUser,
} from './profile.controller';
import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),
  getMyProfile,
);

router.put(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),

  updateMyProfileWithUser,
);

export const ProfileRoutes = router;
