import express from 'express';
import { peopleDb } from '../database.js';

const router = express.Router();

router.get('/listeners', async (req, res) => {
    res.sendFile('client/friends-listening/index.html', {root: '.'});
});

router.get('/allListeners', async (req, res) => {
    res.json(await peopleDb.readAllUsers());
})

export {router};