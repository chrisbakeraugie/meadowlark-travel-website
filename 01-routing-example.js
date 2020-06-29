const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('\n\nALWAYS');
  next();
});

app.get('/a', (req, res) => {
  console.log('/a: route terminated');
  res.send('a');
});

app.get('/a', (req, res) => {
  console.log('Never runs');
});

app.get('/b', (req, res, next) => {
  console.log('/b: route not terminated');
  next();
});

app.use((req, res, next) => {
  console.log('SOMETIMES');
  next();
});

app.get('/b', (req, res, next) => {
  console.log('/b (part 2): error thrown');
  throw new Error('b failed');
});

app.use('/b', (err, req, res, next) => {
  console.log('error detected and passed on');
  next(err);
});

/* eslint-disable handle-callback-err */
app.get('/c', (err, req) => {
  console.log('/c: error thrown');
  throw new Error('c failed');
});

app.use('/c', (err, req, res, next) => {
  console.log('/c: error detected but not passed on');
  next();
});

app.use((err, req, res, next) => {
  console.log('unhandled error deteted ' + err.message);
  res.send('404 - not found');
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Express started on port ${port} and also trump is shit`);
});
