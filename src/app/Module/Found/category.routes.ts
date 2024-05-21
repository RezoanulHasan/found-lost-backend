import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import { createFoundItemCategory } from './found.controller';

const router = express.Router();

router.post('/', auth(UserRole.USER), createFoundItemCategory);

export const CategoryRoutes = router;
