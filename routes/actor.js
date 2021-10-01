import { Router } from 'express';
import { getAllActors, updateActor, getStreak } from '../controllers/actors';

const router = Router();

router.get('/', getAllActors);

router.put('/', updateActor);

router.get('/streak', getStreak);

export default router;
