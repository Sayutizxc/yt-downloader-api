const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const app = express();
const ytDownloader = require('./yt_downloader');

app.use(cors());
app.options('*', cors()); // to restrict this to one website only, replace the * with your website url
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.send('route: /yt?url=https://youtube.com/watch?v=VIDEOURL&q=QUALITY&format=mp4/mp3');
});

app.get('/yt', async (req, res, next) => {
  try {
    const videoFormat = req.query.format;
    const data = await ytDownloader(req.query.url, (req.query.q === undefined) ? '480' : req.query.q, videoFormat); // this is a very caveman brain solution to the mp3 format, sorry.
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
