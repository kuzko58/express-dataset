import { Router } from 'express';
import { getAllEvents, addEvent, getByActor } from '../controllers/events';

const router = Router();

router.get('/', getAllEvents);

router.get('/actors/:actorId', getByActor);

router.post('/', addEvent);

export default router;
