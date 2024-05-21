import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import { createClaim, getClaims, updateClaimStatus } from './clam.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),
  createClaim,
);

router.get('/', getClaims);
router.put('/:id', updateClaimStatus);

export const ClamRoutes = router;
