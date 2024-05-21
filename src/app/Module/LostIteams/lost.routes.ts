import express from 'express';

import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import {
  deleteLostItemById,
  getLostItemById,
  reportLostItem,
  updateLostItemById,
} from './lost.controller';

const router = express.Router();

router.post('/', auth(UserRole.USER), reportLostItem);

router.get('/:id', getLostItemById);
router.put('/:id', updateLostItemById);

router.delete('/:id', deleteLostItemById);

export const LostRoutes = router;