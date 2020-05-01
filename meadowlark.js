const express = require('express');
const expressHandleBars = require('express-handlebars');

const app = express();

const port = process.env.PORT || 3005;

//this array of fortunes is being used to explain dynamic information
const fortunes = [
    "Conquer your fears or they will conquer you",
    "Rivers need springs",
    "Do not fear what you don't know",
    "You will have a pleasant suprise",
    "Whenever possible, keep it simple",
    "Epstein didn't kill himself"
]

//configure Handlebars view engine
app.engine('handlebars', expressHandleBars({
    defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')

//IMPORTANT Middleware is processed in order

//This STATIC middleware has the same effect as creating a route for each static 
//file you want to deliver that renders a file and returns it to the client
app.use(express.static(__dirname + '/public'))

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
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
    res.render('about', {fortune: randomFortune})

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



app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; ` + `press Ctrl-C to terminate.`)
})