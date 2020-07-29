
const fortune = require('./fortune');
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const db = require('../00-mongodb/db');

// Added in chapter 13 for persistance
const pathUtils = require('path');
const fs = require('fs');
//

exports.home = (request, response) => {
  response.render('home')
};

exports.about = (req, res) => {
  console.log(req.session);
  res.render('about', { fortune: fortune.getFortune() });
  res.clearCookie('monster');
}

exports.newsletter = (req, res) => {
  // dummy value csrf
  res.render('newsletter', { csrf: 'CSRF token goes here' });
}
// create directory to store vacation photos (if it doesn't already exist)
const dataDir = pathUtils.resolve(__dirname, '..', 'data');
const vacationPhotosDir = pathUtils.join(dataDir, 'vacation-photos');
if (fs.existsSync(dataDir) === false) {
  fs.mkdirSync(dataDir);
}
if (fs.existsSync(vacationPhotosDir) === false) {
  fs.mkdirSync(vacationPhotosDir);
}

function saveContestEntry(contestName, email, year, month, photoPath) {
  // TODO
}

// these are promise-based versions of fs functions
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);

exports.api = {
  newsletterSignup: (req, res) => {
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (fron visible form field): ' + req.body.email);
    res.send({ result: 'Success' });
  },

  vacationPhotoContest: async (req, res, fields, files) => {
    const photo = files.photo[0];
    const dir = vacationPhotosDir + '/' + Date.now();
    const path = dir + '/' + photo.originalFilename;

    await mkdir(dir);
    await rename(photo.path, path);

    saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path);

    console.log(path);
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.send({ result: 'success' })
  }
}

exports.newsletterSignup = (req, res) => {
  // we will learn about CSRF later
  // This is a dummy value for now
  res.render('newsletter-signup', { csrf: 'CSRF token goes here' });
};

exports.newsletterSignupProcess = (req, res) => {
  console.log('Ran newsletterSignupProcess');
  const name = req.body.name || '';
  const email = req.body.email || '';
  if (EMAIL_REGEX.test(email) === false) {
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The email address you entered was totally bs.'
    }
    return res.redirect(303, '/newsletter-signup');
  } else {
    req.session.flash = {
      type: 'success',
      intro: 'THaNk yOu',
      message: 'You\'ll now have all of my thoughts beamed directly into your head'
    }
  }
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + name);
  console.log('Email (fron visible form field): ' + email);
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

exports.vacationPhotoAPI = (req, res) => {
  res.render('contest/vacation');
}

exports.listVacations = async (req, res) => {
  const vacations = await db.getVacations({ available: true });
  const context = {
    vacations: vacations.map(vacation => ({
      sku: vacation.sku,
      name: vacation.name,
      description: vacation.description,
      price: '$' + vacation.price.toFixed(2),
      inSeason: vacation.inSeason
    }))
  };
  res.render('vacations', context);
}

exports.notifyWhenInSeasonForm = (req, res) => {
  res.render('notify-me-when-in-season', { sku: req.query.sku });
}

exports.notifyWhenInSeasonProcess = async (req, res) => {
  const { email, sku } = req.body;
  await db.addVacationInSeasonListener(email, sku);
  return res.redirect(303, '/vacations');
}

exports.sectionTest = (req, res) => res.render('section-test');

exports.notFound = (req, res) => res.render('404');

// Express recognizes the error handler by the number of arguments (4)
/* eslint-disable handle-callback-err */
exports.serverError = (err, req, res, next) => { return res.render('500'); };
/* eslint-disable handle-callback-err */
