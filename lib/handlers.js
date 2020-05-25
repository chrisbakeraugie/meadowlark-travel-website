exports.api = {};

const fortune = require('./fortune');

exports.home = (request, response) => response.render('home');

exports.about = (req, res) => {
  res.render('about', { fortune: fortune.getFortune() });
}

exports.newsletter = (req, res) => {
  // dummy vale csrf
  res.render('newsletter', { csrf: 'CSRF token goes here' });
}

exports.api = {
  newsletterSignup: (res, req) => {
    // These req.req statements are neccessary because of the way that data is being
    // Sent in fetch() form. There's likely a better solution, but this is good enough
    // To demonstrate the fetch() 'POST' technique
    console.log('CSRF token (from hidden form field): ' + req.req.body._csrf);
    console.log('Name (from visible form field): ' + req.req.body.name);
    console.log('Email (fron visible form field): ' + req.req.body.email);
    res.send({ result: 'Success' });
  }
}

exports.newsletterSignup = (req, res) => {
  // we will learn about CSRF later
  // This is a dummy value for now
  res.render('newsletter-signup', { csrf: 'CSRF token goes here' });
};

exports.newsletterSignupProcess = (req, res) => {
  console.log(req);
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (fron visible form field): ' + req.body.email);
  res.redirect(303, '/newsletter-signup/thank-you');
}

exports.newsletterSignupThankYou = (req, res) => {
  res.render('newsletter-signup-thank-you');
}

exports.vacationPhotoContest = (req, res) => {
  const now = new Date(); // This is needed to fill in the route parameters
  res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() });
}

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log('field data', fields);
  console.log('files: ', files);
  res.redirect(303, '/contest/vacation-photo-thank-you');
}

exports.vacationPhotoContestThankYou = (req, res) => {
  res.render('contest/vacation-photo-thank-you');
}

exports.sectionTest = (req, res) => res.render('section-test');

exports.notFound = (req, res) => res.render('404');

// Express recognizes the error handler by the number of arguments (4)
/* eslint-disable handle-callback-err */
exports.serverError = (err, req, res, next) => { return res.render('500'); };
/* eslint-disable handle-callback-err */
