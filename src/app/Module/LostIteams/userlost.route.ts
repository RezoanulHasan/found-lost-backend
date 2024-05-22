import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import { getLostItemsByUser } from './lost.controller';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),
  getLostItemsByUser,
);
export const LostItemByUserRoutes = router;
