const fortune = require('./fortune');

exports.home = (request, response) => response.render('home');

exports.about = (req, res) => {
  res.render('about', { fortune: fortune.getFortune() });
}

exports.notFound = (req, res) => res.render('404');

// Express recognizes the error handler by the number of arguments (4)
/* eslint-disable handle-callback-err */
exports.serverError = (err, req, res, next) => { return res.render('500'); };
/* eslint-disable handle-callback-err */
