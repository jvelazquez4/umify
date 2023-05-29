import express, { urlencoded } from 'express';

const router = express.Router();

router.get('/vibezone', (req, res) => {
    res.sendFile('client/vibe-zone/vibe.html', { root: '.' });
});

export{router};