const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const router = require('./router/routes.js');

app.set('HTTP_PORT', 3030);
app.set('HTTPS_PORT', 8000);
const options = {
    key: fs.readFileSync('./ssl/rootca.key'),
    cert: fs.readFileSync('./ssl/rootca.crt')
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, '/')));
// app.use(express.static(path.join(__dirname, '/player')));
// app.use(express.static(path.join(__dirname, '/js')));
// app.use(express.static(path.join(__dirname, '/player/js')));

app.use('/', router);
app.use((req, res, next) => {
    const error = new Error(`😢 ${req.method} ${req.url} none of router.`);
    error.status = 404;
    next(error);
})
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})

http.createServer(app).listen(app.get('HTTP_PORT'));
https.createServer(options, app).listen(app.get('HTTPS_PORT'));