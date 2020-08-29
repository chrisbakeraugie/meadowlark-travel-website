const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const cookieParser = require('cookie-parser');
const { credentials } = require('./config'); // Only works with brackets? Must be considreed an object
const expressSession = require('express-session');
const flashMiddleware = require('./lib/middleware/flash');
// const db = require('./00-mongodb/db');
// const redis = require('redis');
const RedisStore = require('connect-redis')(expressSession); // this is a "quirk" of using session stores. Read Below
// Having to pass expressSession to the function returned from connect-redis "to get the constructor"

/**
 * This object is not important.
 * This object is used for Route params demonstration
 */
const staff = {
  portland: {
    mitch: {
      name: 'Mitch',
      bio: 'Mitch is the man to have at your back in a bar fight.'
    },
    madeline: {
      name: 'Madeline',
      bio: 'She is our Oregon Expert'
    }
  },
  bend: {
    walt: {
      name: 'Walt',
      bio: 'Walt is our Oregon Coast Expert'
    }
  }
}

const app = express();

const routes = require('./routes/routes');
routes(app);

const handlers = require('./lib/handlers');
const weatherMiddlware = require('./lib/middleware/weather');


if (require.main === module) { // require.main === module means the script has been run directly
  app.listen(port, () => {
    console.log('Express started in ' + app.get('env') + ` mode http://localhost:${port}; press Ctrl-C to terminate.`);
  })
} else {
  module.exports = app;
}

// Replaced with if(require.main) in order to practice integration testing

// app.listen(port, () => {
//     console.log(`Express started on http://localhost:${port}; ` + `press Ctrl-C to terminate.`)
// })
