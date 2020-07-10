const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const cookieParser = require('cookie-parser');
const { credentials } = require('./config'); // Only works with brackets? Must be considreed an object
const expressSession = require('express-session');
const flashMiddleware = require('./lib/middleware/flash');

const app = express();

const handlers = require('./lib/handlers');
const weatherMiddlware = require('./lib/middleware/weather');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cookieParser(credentials.cookieSecret));

app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret
}));

app.use(flashMiddleware);

const port = process.env.PORT || 3005;

// //this array of fortunes is being used to explain dynamic information
// // ******        MOVED TO lib/fortune.js             *************
// const fortunes = [
//     "Conquer your fears or they will conquer you",
//     "Rivers need springs",
//     "Do not fear what you don't know",
//     "You will have a pleasant suprise",
//     "Whenever possible, keep it simple",
//     "Epstein didn't kill himself"
// ]

// const fortune = require('./lib/fortune') NOT USED BECAUSE IT WAS MOVED TO fortune.js

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    }
  }
}))
app.set('view engine', 'handlebars')

// IMPORTANT Middleware is processed in order

// This STATIC middleware has the same effect as creating a route for each static
// file you want to deliver that renders a file and returns it to the client
/* eslint-disable no-path-concat */
app.use(express.static(__dirname + '/public'));
/* eslint-disable no-path-concat */

app.get('/', handlers.home);

app.get('/about', handlers.about);
app.get('/section-test', handlers.sectionTest);

app.get('/newsletter', handlers.newsletter);

app.post('/api/newsletter-signup', handlers.api.newsletterSignup);

app.get('/newsletter-signup', handlers.newsletterSignup); // REMEMBER THAT ORDER OF THESE APP.METHODS MATTERS
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess);
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou);

app.get('/contest/vacation-photo-thank-you', handlers.vacationPhotoContestThankYou);
app.get('/contest/vacation-photo', handlers.vacationPhotoContest);
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    handlers.vacationPhotoContestProcess(req, res, fields, files);
  });
});

app.get('/vacation-photo', handlers.vacationPhotoAPI);
app.post('/api/vacation-photo-contest', (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log('Ran error if statement');
    }
    handlers.api.vacationPhotoContest(req, res, fields, files);
  });
});

app.get('/fail', (req, res) => {
  throw new Error('Nope!');
});

// use this to creash the server...for some reason
app.get('/huge-fail', (req, res) => {
  process.nextTick(() => {
    throw new Error('Meltdown');
  });
});


// 404 page
app.use(handlers.notFound);

// 500 page
app.use(handlers.serverError);

app.use(weatherMiddlware);

/*
Everything in this comment section is replaced by handlers.js, refeactoring that is being
done to practice QA code testing.
Leaving it here for the purpose of remembering the basics of Express

//route to the home page
app.get('/', (req, res) => {
    //Handlebars render
    res.render('home')

    //Non-handlebar framwork   vvvvv
    // res.type('text/plain')
    // res.send('Meadowlark Travel')
})

//route to the about page
app.get('/about', (req, res) => {
    //handlebars render

    //MOVED TO lib/fortunes.js
    //const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
    res.render('about', {fortune: fortune.getFortune() })

    //Non-handlebar framwork   vvvvv
    // res.type('text/plain')
    // res.send('About Meadowlark Travel')
})

//custom 404 page
app.use((request, response) => {
    response.type('text/plain');
    response.status(404);
    response.send('404 - No Page for U');
})

//custom 500 page
app.use((err, req, res, next) => {
    console.error(err.message);
    res.type('text/plain');
    res.status(500)
    res.send('500 - Server Error')
})

*/

if (require.main === module) { // require.main === module means the script has been run directly
  app.listen(port, () => {
    console.log('Express started in ' + app.get('env') + ` mode http://localhost:${port}; press Ctrl-C to terminate.`);
  })
} else {
  module.exports = app;
}

// Replaced with if(require.main) in order to practice integration testing

// app.listen(port, () => {
//     console.log(`Express started on http://localhost:${port}; ` + `press Ctrl-C to terminate.`)
// })
