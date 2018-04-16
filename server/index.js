const port = 3002

import express from 'express'
import cors from 'cors';

import session from 'express-session'

const app = express()
app.use(cors());

import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );

app.use(session({
  secret: 'dog vs cat',
  resave: true,
  saveUninitialized: false,
}))


const api = require('./routes/api');

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// get for test
app.get('/', api.echo);

app.post('/', api.echo);
app.post('/create_user', api.create_user);
app.post('/login_with_email_password', api.login_with_email_password);
app.post('/login_with_token', api.login_with_token);
app.post('/logout', api.logout);
app.post('/upload_image', api.upload_image);
app.post('/upload_game', api.upload_game);
app.post('/get_mygames', api.get_mygames);
app.get('/search_games', api.search_games);
app.get('/search_games', api.search_games_description);

app.listen(port);
console.log('Listening on port '+port+'...');
