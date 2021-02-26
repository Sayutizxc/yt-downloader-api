const morgan = require('morgan');
const express = require('express');
const app = express();
const ytDownloader = require('./yt_downloader');

app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.get('/yt', async (req, res, next) => {
  try {
    const data = await ytDownloader(req.query.url, req.query.q);
    res.json({
      status: res.statusCode,
      result: data,
    });
  } catch (error) {
    next(error);
  }
});

// Handle error 404
app.use((req, res, next) => {
  err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Send error message
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    status: error.status || 500,
    message: error.message,
  });
});

app.listen(3000, () => {
  console.log('[SERVER] BERJALAN PADA http://localhost:3000');
});
