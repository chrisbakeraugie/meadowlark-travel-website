const fortune = require('./fortune');

exports.home = (request, response) => response.render('home');

exports.about = (req, res) => {
  res.render('about', { fortune: fortune.getFortune() });
}

exports.newsletterSignup = (req, res) => {
  // dummy vale csrf
  res.render('newsletter-signup', { csrf: 'CSRF token goes here' });
}

exports.api = {
  newsletterSignup: (res, req) => {
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (fron visible form field): ' + req.body.email);
    res.send({ result: 'Success' });
  }
}
/*
  These methods are being removed to test the fetch method of form processing.
  See Chapter 8, page 93
exports.newsletterSignup = (req, res) => {
  // we will learn about CSRF later
  // This is a dummy value for now
  res.render('newsletter-signup', { csrf: 'CSRF token goes here' });
};

exports.newsletterSignupProcess = (req, res) => {
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (fron visible form field): ' + req.body.email);
  res.redirect(303, '/newsletter-signup/thank-you');
}

exports.newsletterSignupThankYou = (req, res) => {
  res.render('newsletter-signup-thank-you');
}
*/

exports.sectionTest = (req, res) => res.render('section-test');

exports.notFound = (req, res) => res.render('404');

// Express recognizes the error handler by the number of arguments (4)
/* eslint-disable handle-callback-err */
exports.serverError = (err, req, res, next) => { return res.render('500'); };
/* eslint-disable handle-callback-err */
