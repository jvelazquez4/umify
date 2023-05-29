import { peopleDb} from './database.js';
import express, { urlencoded } from 'express';
import logger from 'morgan';
import {router as registerRouter} from './routes/register.js';
import {router as friendRouter} from './routes/friends.js'; 
import {router as vibeRouter} from './routes/vibezone.js';
import {router as profileRouter} from './routes/profile.js';
import {router as loginRouter} from './routes/login.js';
import {router as listenersRouter} from './routes/listeners.js';
import {router as spotifyAPIRouter} from './routes/spotify-api.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/listeners', express.static('client/friends-listening'));
app.use('/friends', express.static('client/friends-list'));
app.use('/login', express.static('client/login'));
app.use('/profile', express.static('client/profile'));
app.use('/vibezone', express.static('client/vibe-zone'));
app.use('/images', express.static('images'));
app.use('/', express.static('client/home-page'));
app.use('/register', express.static('client/register'));
app.use('/fetching', express.static('client/fetching.js'));

//Routers
app.use('/', registerRouter);
app.use('/', friendRouter);
app.use('/', vibeRouter);
app.use('/', profileRouter);
app.use('/', loginRouter);
app.use('/', listenersRouter);
app.use('/',spotifyAPIRouter);

//Home page route
app.get('/', async(req,res)=>{
    res.sendFile('client/home-page/homepage.html', { root: '.' });
})

// General purpose routes 
app.post('/userInfo', async(req, res) => {
    let info = req.body;
    if("username" in info){
        let curInfo = await peopleDb.readUser(info.username);
        res.status(200).json(curInfo);
    }
    else{
        res.status(400)
    }
});

//Anything 
app.all('*', async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
});

 app.listen(port,()=>{
     console.log(`Server started on http://localhost:${port}`)
 })
