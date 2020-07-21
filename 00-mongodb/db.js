/**
 * Any file that needs to access the database can simply require('00-mongodb/db');
 */


const { credentials } = require('../config');
const mongoose = require('mongoose');
const { connectionString } = credentials.mongoose;

if (!connectinoString) {
  console.error('MongoDB connection string missing');
  process.exit(1);
}

mongoose.connect(connectionString)

const db = mongoose.connection
db.on('error' err => {
  console.error('MongoDB error: ' + err.message);
  process.exit(1);
});

db.once('open', () => {
  console.log('MongoDB connection established');
});

module.exports = {
  getVacations: async () => {
    // ... returns fake vaction data
  },

  addVacationInSeasonListener: async (email, sku) => {
    // ... nothing???
  }
};

