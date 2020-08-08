const { credentials } = require('../config');

const { Client } = require('pg');
const { connectionString } = credentials.postgres;
const client = new Client({ connectionString });

/**
 * some Schema explanation:
 *
 * each line has a column name[space]datatype
 * varchar(200) - this is capping the length of a name at 200 characters arbitrarily
 *
 * jsonb - a binary representation that's usually higher performance
 */
const createScript = `
 CREATE TABLE IF NOT EXISTS vacations (
   name varchar(200) NOT NULL, 
   slug varchar(200) NOT NULL UNIQUE,
   category varchar(50),
   sku varchar(20),
   description text,
   location_search varchar(100) NOT NULL,
   location_lat double precision,
   location_lng double precision,
   price money,
   tags jsonb,
   in_season boolean,
   available boolean,
   requires_waiver boolean,
   maximum_guests integer,
   notes text,
   packages_sold integer
 );
 `
const getVacationCount = async client => {
  const { rows } = await client.query('SELECT COUNT(*) FROM VACATIONS');
  return Number(rows[0].count);
}

const seedVacations = async client => {
  const sql = `
    INSERT INTO vacations(
      name,
      slug,
      category,
      sku,
      description,
      location_search,
      price,
      tags,
      in_season,
      available,
      requires_waiver,
      maximum_guests,
      notes,
      packages_sold
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `
  await client.query(sql, [
    'Hood River Day Trip',
    'hood-river-day-trip',
    'Day Trip',
    'HR199',
    'Spend a day sailing on the Columbia and enjoy craft beers in Hood River!',
    'Hood River, Oregon, USA',
    99.95,
    // eslint-disable-next-line quotes
    `["day trip", "hood river", "sailing", "windsurfing", "breweries"]`,
    true,
    true,
    false,
    16,
    null,
    0
  ]);

  // USE THE SAME PATTERN TO INSERT OTHER DATA HERE
}

client.connect().then(async () => {
  try {
    console.log('creating database schema');
    await client.query(createScript);
    const vacationCount = await getVacationCount(client);
    if (vacationCount === 0) {
      console.log('seeding vacations');
      await seedVacations(client);
    }
  } catch (err) {
    console.log('ERROR: could not initialize databse');
    console.log(err.message);
  } finally {
    client.end();
  }
});
