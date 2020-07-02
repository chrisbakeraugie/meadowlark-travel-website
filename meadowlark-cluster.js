/*
THIS WON"T WORK UNLESS IN THE MAIN DIRECTORY. SAVED FOR LEARNING PURPOSES
*/
const cluster = require('cluster');


function startWorker () {
  const worker = cluster.fork();
  console.log(`CLUSTER: Worker ${worker.id} started`);
}

if (cluster.isMaster) {
  require('os').cpus().forEach(startWorker);

  // this statement logs any workerthat disconnects
  // We will spawn a new user in the next event
  cluster.on('disconnect', worker => console.log(`CLUSTER: Worker ${worker.id} disconnected from the cluster`));

  // when worker exits, create a worker to replace it
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Cluster: worker ${worker.id} has died with exit code ${code} (${signal})`);
    startWorker();
  });
} else {
  const port = process.env.PORT || 3001;
  // Start our app on worker; see meadowlark.js
  require('./meadowlark-server.js')(port);
}

// function startServer(port) {
//   app.listen(port, function() {
//     console.log(`Express started in ${app.get('env')} ` + ` mode on localhost:${port} -- the 01-server.js file`);
//   });
// }

// if (require.main === module) {
//   // application run directly; start app server
//   console.log('\nRunning directly');
//   startServer(process.env.PORT || 3005);
// } else {
//   // application imported as a module
//   console.log('\nRunning as a module');
//   module.exports = startServer;
// }
