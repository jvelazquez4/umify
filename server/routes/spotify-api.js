import { peopleDb } from "../database.js";
import express, { urlencoded } from 'express';
import querystring from 'querystring';
import fetch from 'node-fetch'

let client_id; //Put client_id here
let client_secret; //Put client_secret here
const Token_Endpoint = "https://accounts.spotify.com/api/token";

const router = express.Router();


//Template for spotify api functions:

async function refreshToken(user){
    //refresh our token
    let data = await peopleDb.readUser(user)
    let refresh_token = data.spotifyData.refresh_token;
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
    let response = await fetch(Token_Endpoint, {
        method:'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token
        }),
    })
    return response.json();
}

export async function getTopArtist(user){
    let endpoint = "https://api.spotify.com/v1/me/top/artists"
    const { access_token } = await refreshToken(user);

    return fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
}

export async function getTopTracks(user){
    let endpoint = "https://api.spotify.com/v1/me/top/tracks"
    const { access_token } = await refreshToken(user);

    return fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
}

//this is actually featured playlists
//it can pull up to a certain amount but i just used the default value of 20
export async function getTopPlaylists(user){
    let endpoint = "https://api.spotify.com/v1/me/playlists"
    const { access_token } = await refreshToken(user);

    return fetch(endpoint, {
        headers:{
            Authorization: `Bearer ${access_token}`,
        }
    });
}

export async function getCurrentlyPlaying(user){
    let endpoint = "https://api.spotify.com/v1/me/player/currently-playing"
    const { access_token } = await refreshToken(user);

    return fetch(endpoint, {
        headers:{
            Authorization: `Bearer ${access_token}`,
            "Content-type": "application/json"
        }
    });
}

export async function getRecentlyPlayed(user){
    let endpoint = "https://api.spotify.com/v1/me/player/recently-played"
    const { access_token } = await refreshToken(user);

    return fetch(endpoint, {
        headers:{
            Authorization: `Bearer ${access_token}`,
        }
    });
}

//start routing

router.get('/api/refresh-token', async (req,res) => {
    let user = req.query.user;
    
    const refresh = await refreshToken(user);

    if(refresh.ok){
        const data = await refresh.json();
        res.json(data);
    } else {
        throw new Error('Failed to refresh token');
    }
})

router.get('/api/currently-playing', async (req,res) => {
    let user = req.query.user;
    
    console.log("here");

    const curr_playing = await getCurrentlyPlaying(user);

    console.log(curr_playing);

    try {
        if(curr_playing.ok){
            const data = await curr_playing.json();
            res.json(data);
        } else {
            throw new Error('Failed to get currently playing');
        }
    } catch (err) {
        res.json({status : false})
    }
})

router.get('/api/top-playlist', async (req,res) => {
    let user = req.query.user;
    
    const top_playlist = await getTopPlaylists(user);

    if(top_playlist.ok){
        const data = await top_playlist.json();
        res.json(data);
    } else {
        throw new Error('Failed to get top playlists');
    }
})

router.get('/api/top-artist', async (req,res) => {
    let user = req.query.user;
    
    const top_artist = await getTopArtist(user);

    if(top_artist.ok){
        const data = await top_artist.json();
        res.json(data);
    } else {
        throw new Error('Failed to get top-artists');
    }
})

router.get('/api/top-tracks', async (req,res) => {
    let user = req.query.user;
    
    const top_tracks = await getTopTracks(user);

    if(top_tracks.ok){
        const data = await top_tracks.json();
        res.json(data);
    } else {
        throw new Error('Failed to get top tracks');
    }
})

router.get('/api/recently-played-tracks', async (req,res) => {
    let user = req.query.user;
    
    const recently = await getRecentlyPlayed(user);

    if(recently.ok){
        const data = await recently.json();
        res.json(data);
    } else {
        throw new Error('Failed to get recently played tracks');
    }
})

export{router};