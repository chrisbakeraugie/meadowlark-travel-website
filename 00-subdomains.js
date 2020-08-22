const express = require('express');
const vhost = require('vhost');
const app = express();
// creating an admin subdomain
// this should appear before all other routes

var admin = express.Router()
app.use(vhost('admin.meadowlark.localhost', admin));

// create admin routes; these can be defined anwywhere
admin.get('*', (req, res) => { res.send('Welcome, Admin!') });

// regular routes
app.get('*', (req, res) => { res.send('Welcome, User!') });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running subdomain.js on port ${port}`)
});
