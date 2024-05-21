import express from 'express';
import { registration } from './auth.controller';

const router = express.Router();

router.post('/', registration);
export const RegistrationRoutes = router;
