/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { NotFoundError } = require('./utils/errors');
const storeRouter = require('./routes/store');

const app = express();

app.use(morgan('tiny'));
// app.use(express.json());
app.use(cors());
app.use('/store', storeRouter);

/* Handle all 404 errors that weren't matched by a route */
app.use((req, res, next) => next(new NotFoundError()));

/* Generic error handler - anything that is unhandled will be handled here */
app.use((error, req, res) => {
  const status = error.status || 500;
  const { message } = error;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;