import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import {
  deleteFoundItemById,
  getFoundItemById,
  getFoundItems,
  reportFoundItem,
  updateFoundItemById,
} from './found.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SuperAdmin),
  reportFoundItem,
);
router.get('/', getFoundItems);
router.get('/:id', getFoundItemById);
router.delete('/:id', deleteFoundItemById);
router.put('/:id', updateFoundItemById);

export const ItemRoutes = router;
