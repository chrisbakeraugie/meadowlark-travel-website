const fortune = require('./fortune');

exports.home = (request, response) => response.render('home');

exports.about = (req, res) => {
    res.render('about', { fortune: fortune.getFortune() });
}

exports.notFound = (req, res) => res.render('404');

exports.serverError = (err, req, res, next) => {
    return res.render('500');
};
