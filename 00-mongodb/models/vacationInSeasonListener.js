const mongoose = require('mongoose');

const vacationInSeasonLiternerSchema = mongoose.Schema({
  email: String,
  skus: [String]
});

const VacationInSeasonListener = mongoose.model('VacationInSeasonListener', vacationInSeasonLiternerSchema);

module.exports = VacationInSeasonListener;
