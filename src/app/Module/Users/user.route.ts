import express from 'express';
import {
  deleteALLTime,
  getAllUsers,
  getUserById,
  updateUser,
} from './adminController';

//import auth from '../../middlewares/authMiddleware';
//import { UserRole } from '@prisma/client';

const router = express.Router();

router.put('/:id', updateUser);

router.delete('/:id', deleteALLTime);

router.get('/', getAllUsers);

router.get('/:id', getUserById);

export const UserRoutes = router;
