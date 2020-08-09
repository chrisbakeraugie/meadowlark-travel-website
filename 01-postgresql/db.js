const { Pool } = require('pg');
const _ = require('lodash'); // Kinda seems like a pun

const { credentials } = require('../config');

const { connectionString } = credentials.postgres;
const pool = new Pool({ connectionString });
module.exports = {
  getVacations: async () => {
    const { rows } = await pool.query('SELECT * FROM VACATIONS');
    return rows.map(row => {
      const vacation = _.mapKeys(row, (v, k) => _.camelCase(k));
      vacation.price = parseFloat(vacation.price.replace(/^\$/, ''));
      vacation.location = {
        search: vacation.locationLat,
        coordinates: {
          lat: vacation.locationLat,
          lng: vacation.loccationLng
        }
      }
      return vacation;
    })
  },

  addVacationListener: async (email, sku) => {
    await pool.query(
      'INSERT INTO vacation_in_season_listeners (email, sku) ' +
      'VALUES ($1, $2) ' +
      'ON CONFLICT DO NOTHING',
      [email, sku]
    )
  }
};
