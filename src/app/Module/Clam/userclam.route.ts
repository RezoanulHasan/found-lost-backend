import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';

const router = express.Router();

router.get(
  '/',

  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),
);
export const ClamItemByUserRoutes = router;
