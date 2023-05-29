import express, { urlencoded } from 'express';
import logger from 'morgan';
import { peopleDb } from '../database.js';

const router = express.Router();

router.get('/profile', (req, res) => {
    res.sendFile('client/profile/profile.html', { root: '.' });
});

router.post('/profile', async (req, res) => {
    const user = req.body._user;
    const updatedProfile = req.body;

    // updating in mongodb db
    await peopleDb.updateUserInfo({_username: user}, {$set: updatedProfile});
    res.status(200);
    res.end();
});

export {router}
