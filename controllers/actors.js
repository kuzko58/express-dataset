import models from '../models';

const { actors } = models;

export const getAllActors = async (req, res, next) => {
  try {
    const allActors = await actors.findAll({
      attributes: ['id', 'login', 'avatar_url'],
      order: [['event_count', 'DESC'], ['last_seen', 'DESC'], ['login', 'ASC']],
    });
    res.status(200).json(allActors);
  } catch (error) {
    next(new Error('server error'));
  }
};

export const updateActor = async (req, res, next) => {
  try {
    const { id, avatar_url } = req.body;
    const [updateCount] = await actors.update({ avatar_url }, { where: { id } });

    if (!updateCount) return res.status(404).send();

    res.status(200).send({});
  } catch (error) {
    next(new Error('Server error'));
  }
};

export const getStreak = async (req, res, next) => {
  try {
    const allActors = await actors.findAll({
      attributes: ['id', 'login', 'avatar_url'],
      order: [['main_streak', 'DESC'], ['last_seen', 'DESC'], ['login', 'ASC']],
    });
    res.status(200).json(allActors);
  } catch (error) {
    next(new Error('server error'));
  }
};
