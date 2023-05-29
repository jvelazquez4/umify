import express, { urlencoded } from 'express';
import logger from 'morgan';
import {peopleDb} from '../database.js';
import querystring from 'querystring';
import axios from 'axios';


let curr_user;
let curr_passwd;

let generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


const router = express.Router();

router.get('/register', (req, res)=>{
    res.sendFile('client/register/register.html', { root: '.' });
})
router.post('/register',async (req,res) => {
    const info = req.body;
    const username = info.username;
    const password = info.password;
    curr_user = username;
    curr_passwd = password;
    let taken = await peopleDb.readUser(username);
    console.log(taken)
    if(taken === null){
        console.log("user does not exist! Start Spotify Authentication!")
        let state = generateRandomString(16);
        let scope = "user-read-recently-played user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-collaborative playlist-modify-public user-top-read";
        let client_id; //Set this equal to client_id
        let redirect_uri = 'http://localhost:3000/callback';
        const spotifyAuthUrl = ('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
        res.json({authURL: spotifyAuthUrl});
    }   
})

router.get("/callback", async (req,res) => {
    let code = req.query.code || null;
    let state = req.query.state || null;
    let client_id; //Set this equal to client_id
    let client_secret; //Set this equal to client secret
    let redirect_uri = 'http://localhost:3000/callback';

    if (state === null) {
        res.redirect('/#' +
          querystring.stringify({
            error: 'state_mismatch'
          }));
      } else {
        var authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
          },
          headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          json: true
        };
        //resp.json(authOptions);
    }

    await axios.post(authOptions.url, authOptions.form,{headers:authOptions.headers}).then(async (response) => {
        //if our response goes through we need to update our database with the username, password, access token and refresh token

        if(response.status === 200){
            let {access_token,refresh_token} = response.data;
            console.log("first response");
            console.log(response.data);
            
            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers:{
                    'Authorization': 'Bearer ' + access_token
                }
            };

            await axios.get(options.url, {headers: options.headers}).then(async (resp) => {
                //we got data, add user and passwd
                console.log("second Response");
                console.log(resp.data);
                console.log(curr_user);
                console.log(curr_passwd);
                let info = {
                    "username": curr_user,
                    "password": curr_passwd, //change this to be hash eventually
                    "friends": [],
                    "pending": [],
                    "profile": {
                        "picture": "https://images.nightcafe.studio//assets/profile.png?tr=w-1600,c-at_max",
                        "name": curr_user,
                        "username":curr_user,
                    },
                    "pronouns": "None Set",
                    "bio": "None Set"
                }
                let img;
                try{
                    img = resp.data.images[0].url
                } catch {
                    img = "https://www.vecteezy.com/vector-art/1840618-picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector"
                }
                let spotify_data = {
                    access_token: access_token,
                    refresh_token: refresh_token,
                    display_name: resp.data.display_name,
                    id: resp.data.id,
                    images: [
                        img
                    ]
                }
                let geodata = {
                    latitude: undefined,
                    longitude: undefined
                }
                await peopleDb.createUser(curr_user,info,geodata,spotify_data)
                
                
            }).catch((error) => {
                console.log(error);
                curr_user = undefined;
                curr_passwd = undefined;
            });
            response.redirect('/listeners');
        } else {
            response.redirect('/#' + querystring.stringify({error:'invalid_token'}));
        }
    }).catch((error) => {
            console.log(error)
            curr_passwd = undefined;
            curr_user = undefined;
        })

})


export {router};