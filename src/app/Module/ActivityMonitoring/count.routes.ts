import express from 'express';
import { getCounts } from './count.controller';

const router = express.Router();

router.get('/', getCounts);

export const CountRoutes = router;
