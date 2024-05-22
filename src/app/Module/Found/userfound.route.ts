import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import { getFoundItemsByUser } from './found.controller';

const router = express.Router();

router.get(
  '/',

  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),
  getFoundItemsByUser,
);
export const FoundItemByUserRoutes = router;
