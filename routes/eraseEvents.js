import { Router } from 'express';
import { eraseEvents } from '../controllers/events';

const router = Router();

router.delete('/', eraseEvents);

export default router;
