/**
 * Any file that needs to access the database can simply require('00-mongodb/db');
 */

const { credentials } = require('../config');
const mongoose = require('mongoose');
const { connectionString } = credentials.mongo;
const Vacation = require('./models/vacation');

if (!connectionString) {
  console.error('MongoDB connection string missing');
  process.exit(1);
}

mongoose.connect(connectionString)

const db = mongoose.connection
db.on('error', err => {
  console.error('MongoDB error: ' + err.message);
  process.exit(1);
});

db.once('open', () => {
  console.log('MongoDB connection established');
});

// Seeds data if neccessary
Vacation.find((err, vacations) => {
  if (err) {
    return console.log(err);
  }
  if (vacations.length > 3) {
    console.log('Number of vacations entries: ' + vacations.length);
    return
  }
  console.log('Number of vacations entries: ' + vacations.length);
  new Vacation({
    name: 'Hood River Day Trip',
    slug: 'hood-river-day-trip',
    category: 'Day Trip',
    sku: 'HR199',
    description: 'Spend a day sailing on the Columbia and enjoying craft beers in Hood River!',
    location: {
      search: 'Hood River, Oregon, USA'
    },
    price: 99.95,
    tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0
  }).save();

  new Vacation({
    name: 'Oregon Coast Getaway',
    slug: 'oregon-coast-getaway',
    category: 'Weekend Getaway',
    sku: '0C39',
    description: 'Enjoy the ocean air from coastal towns',
    location: {
      search: 'Cannon Beach, Oregon, USA',
    },
    price: '269.95',
    tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
    inSeason: false,
    maximumGuests: 8,
    available: true,
    packagesSold: 0
  }).save();

  new Vacation({
    name: 'Rock Climbing in Bend',
    slug: 'rock-climbing-in-bend',
    category: 'Adventure',
    sku: 'B99',
    description: 'Experience the thrill of climbing in the high desert',
    location: {
      search: 'Bend, Oregon, USA'
    },
    price: 289.95,
    tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
    inSeason: true,
    requiresWaiver: true,
    maximumGuests: 4,
    available: false,
    packagesSold: 0,
    notes: 'The tour guide is currently recovering from a skiing accident'
  }).save();
});

module.exports = {
  getVacations: async (options = {}) => Vacation.find(options),

  addVacationInSeasonListener: async (email, sku) => {
    // ... nothing???
  }
};
