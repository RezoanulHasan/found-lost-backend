import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import { createClaim, getClaims, updateClaimStatus } from './clam.controller';

const router = express.Router();

router.post('/', auth(UserRole.USER), createClaim);

router.get('/', auth(UserRole.USER), getClaims);
router.put('/:id', auth(UserRole.USER), updateClaimStatus);

export const ClamRoutes = router;
