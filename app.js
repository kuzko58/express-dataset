import http from 'http';
import express from 'express';
import logger from 'morgan';
import { json, urlencoded } from 'body-parser';

import index from './routes/index';

const app = express();

// eslint-disable-next-line new-cap
const server = new http.createServer(app);

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use('/', index);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({ error: err.message });
});

server.listen(process.env.PORT || 3000);

module.exports = server;
export default server;
