const express = require('express');
const cluster = require('cluster');

const app = express();

// app.use((req, res, next) => {
//   if (cluster.isWorker) {
//     console.log(`Worker ${cluster.worker.id} recieved request`);
//   }
//   next();
// });

// app.get('/', (req, res) => {
//   res.send({ here: 'some json' });
// }) // this was just a test

function startServer (port) {
  app.listen(port, function () {
    console.log(`Express started in ${app.get('env')} ` + `mode on localhost:${port} -- the 01-server.js file`);
  });
}

if (require.main === module) {
  // application run directly; start app server
  startServer(process.env.PORT || 3005);
} else {
  // application being imported somewhere else
  module.exports = startServer;
}
