import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import {
  createClaim,
  deleteClaimById,
  getAllClaims,
  //getAllClaims,
  getClaimById,
  updateClaimStatus,
} from './clam.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),
  createClaim,
);
router.delete('/:id', deleteClaimById);
router.get('/:id', getClaimById);
router.get('/', getAllClaims);
router.put('/:id', updateClaimStatus);

export const ClamRoutes = router;
