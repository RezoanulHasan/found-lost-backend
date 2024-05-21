import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import { getFoundItems, reportFoundItem } from './found.controller';

const router = express.Router();

router.post('/', auth(UserRole.USER), reportFoundItem);

router.get('/', getFoundItems);

export const ItemRoutes = router;
