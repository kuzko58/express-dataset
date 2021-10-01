import moment from 'moment';
import models from '../models';

const { events, actors, repos } = models;

const isStreak = (date1, date2) => {
  const dayDifference = date1.getDay() - date2.getDay();
  const isNextDay = dayDifference === 1 || dayDifference === -6;
  const isValid = (date1 - date2) / 8.64e7 <= 24;
  return isNextDay && isValid;
};

const isSameDay = (date1, date2) => {
  const dayDifference = date1.getDay() - date2.getDay();
  const isValid = (date1 - date2) / 8.64e7 <= 24;
  return dayDifference === 0 && isValid;
};

const updateStreak = async (actorId) => {
  const latestEvents = await events.findAll({
    where: { actorId },
    include: {
      model: actors,
      attributes: ['main_streak', 'sub_streak'],
    },
    order: [['created_at', 'DESC']],
  });

  const [first, second] = latestEvents;

  await actors.update(
    {
      event_count: latestEvents.length,
      last_seen: first.created_at,
    },
    { where: { id: actorId } },
  );

  let main_streak = 0;
  let sub_streak = 0;

  if (latestEvents.length === 1) return;
  if (isSameDay(first.created_at, second.created_at)) return;

  sub_streak = isStreak(first.created_at, second.created_at) ? first.actor.sub_streak + 1 : 0;
  main_streak = sub_streak > first.actor.main_streak ? sub_streak : first.actor.main_streak;

  await actors.update(
    {
      main_streak,
      sub_streak,
    },
    { where: { id: actorId } },
  );
};

const formatDate = (results) => results.map((result) => {
  const offset = -result.created_at.getTimezoneOffset();
  const newTime = moment(result.created_at.toISOString()).add(offset, 'minutes');
  const created_at = newTime
    .toISOString()
    .replace(/(\d+-\d+-\d+)(T)(\d+:\d+:\d+)(\.\d+Z)/g, '$1 $3');
  return { ...result.toJSON(), created_at };
});

export const getAllEvents = async (req, res, next) => {
  try {
    const allEvents = await events.findAll({
      attributes: { exclude: ['actorId', 'repoId'] },
      include: [
        { model: actors, attributes: ['id', 'login', 'avatar_url'] },
        { model: repos, attributes: { exclude: ['actorId', 'eventId'] } },
      ],
      order: [['id', 'ASC']],
    });

    res.status(200).json(formatDate(allEvents));
  } catch (error) {
    next(new Error('server error'));
  }
};

export const addEvent = async (req, res, next) => {
  try {
    const { actor, repo, ...event } = req.body;
    await actors.upsert(actor);
    await repos.upsert({ ...repo, actorId: actor.id });
    await events.create({
      ...event,
      actorId: actor.id,
      repoId: repo.id,
    });
    await updateStreak(actor.id);

    res.status(201).json({
      status_code: 201,
      event,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const err = new Error('event already exists');
      err.status = 400;
      next(err);
    }
    next(new Error('server error'));
  }
};

export const getByActor = async (req, res, next) => {
  try {
    const { actorId } = req.params;

    const allEvents = await events.findAll({
      where: { actorId },
      attributes: { exclude: ['actorId', 'repoId'] },
      include: [
        { model: actors, attributes: ['id', 'login', 'avatar_url'] },
        { model: repos, attributes: { exclude: ['actorId', 'eventId'] } },
      ],
      order: [['id', 'ASC']],
    });

    if (!allEvents.length) return res.status(404).json(formatDate(allEvents));

    res.status(200).json(formatDate(allEvents));
  } catch (error) {
    next(new Error('server error'));
  }
};

export const eraseEvents = async (req, res, next) => {
  try {
    await events.destroy({ truncate: true });
    await repos.destroy({ truncate: true });
    await actors.destroy({ truncate: true });

    res.status(200).json({ message: 'events deleted' });
  } catch (error) {
    next(new Error('server error'));
  }
};
