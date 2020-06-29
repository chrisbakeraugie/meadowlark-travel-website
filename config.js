const env = process.env.NODE_ENV || 'development';
const credentials = require(`./.credentials.${env}`); // Create a .credentials.production.json in order to run in production mode
module.exports = { credentials };
