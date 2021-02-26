const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL, //in other words this is localhost 1.27.0.1 (not sure on exact name)
    ssl: true
  }
});

const app = express();
app.use(bodyParser.json());

app.use(cors({origin: 'https://smart-brain-dpn.herokuapp.com', allowedHeaders: ['Access-Control-Allow-Origin', '*' ], credentials: true, exposedHeaders: ['Access-Control-Allow-Origin', '*']}));

app.get('/', (req, res) => { res.send('it is working') })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req,res) => { image.handleApiCall(req, res, db) })

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT || 3000}`);
})