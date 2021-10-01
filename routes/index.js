import { Router } from 'express';
import models from '../models';
import eraseEvents from './eraseEvents';
import events from './events';
import actor from './actor';

const router = Router();

const syncDb = (() => {
  let isSynced = false;
  return async (req, res, next) => {
    if (!isSynced) {
      await models.sequelize.sync();
      isSynced = true;
    }
    return next();
  };
})();

router.use(syncDb);
router.use('/erase', eraseEvents);
router.use('/events', events);
router.use('/actors', actor);

export default router;
