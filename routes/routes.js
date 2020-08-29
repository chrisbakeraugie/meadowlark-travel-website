


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cookieParser(credentials.cookieSecret));

app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  store: new RedisStore({
    url: credentials.redis.url,
    logErrors: true // best practice to log errors
  })
}));

app.use(flashMiddleware);

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

app.get('/vacations', handlers.listVacations);

app.get('/notify-me-when-in-season', handlers.notifyWhenInSeasonForm);

app.post('/notify-me-when-in-season', handlers.notifyWhenInSeasonProcess);

app.get('/set-currency/:currency', handlers.setCurrency);

app.get('/fail', (req, res) => {
  throw new Error('Nope!');
});

// use this to crash the server...for some reason
app.get('/huge-fail', (req, res) => {
  process.nextTick(() => {
    throw new Error('Meltdown');
  });
});

app.get('/regex|regular(expressions)?|lunacy', (req, res) => {
  res.send('regular expressions work');
});

app.get('/staff/:city/:name', (req, res, next) => {
  const cityStaff = staff[req.params.city];
  const info = cityStaff[req.params.name]
  if (!cityStaff || !info) { // If the URL doesn't match city and/or name
    return next(); // will evetnually reach 404
  }
  res.send(info);
});

// 404 page
app.use(handlers.notFound);

// 500 page
app.use(handlers.serverError);

app.use(weatherMiddlware);
