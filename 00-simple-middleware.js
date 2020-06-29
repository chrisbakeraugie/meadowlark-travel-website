const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`processing request for ${req.url}`);
  next()
});

app.use((req, res, next) => {
  console.log('terminating request');
  res.send('thanks for playing');
  // since we done use next() here, the request is terminating
});

app.use((req, res, next) => {
  console.log('This will never get called');
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`simple-middleware is listening on port ${port}`);
});
