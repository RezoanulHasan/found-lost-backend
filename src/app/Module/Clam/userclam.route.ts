import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import { getAllClaimsForUser } from './clam.controller';

const router = express.Router();

router.get(
  '/clam',
  getAllClaimsForUser,

  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),
);
export const ClamItemByUserRoutes = router;
