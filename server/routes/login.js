import express, { urlencoded } from 'express';
import logger from 'morgan';
import { peopleDb } from '../database.js';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';

const router = express.Router();
const app = express();
app.use(express.json());
// const LocalStrategy = require('passport-local');
  
// passport.use(new LocalStrategy(function verify(username,password, cb){
//     let user = peopleDb.readUser(username);
//     if (user == null){
//         return cb(null, false, { message: 'Incorrect username or password.' });
//     }

//     crypto.pbkdf2(password, )
    
// }))

router.get('/login', (req, res) => {
    res.sendFile('client/login/login.html', { root: '.' });
});

router.post('/login', async (req, res) => {
    const info = req.body; 
    const inputtedUsername = info.username; 
    const inputtedPassword = info.password;

    let foundUser = await peopleDb.readUser(inputtedUsername);
    if(foundUser == null){
        res.status(404).send(`Username or password is incorrect`);
    }
    else if(foundUser.info.password == inputtedPassword){
        res.status(200).send();
    }
    else{
        res.status(404).send(`Username or password is incorrect`);
    }
});

export {router}