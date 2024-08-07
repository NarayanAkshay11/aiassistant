const express = require('express');
const session = require('express-session');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

const microsoftOAuthUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
const spotifyOAuthUrl = 'https://accounts.spotify.com/authorize';
const googleOAuthUrl = 'https://accounts.google.com/o/oauth2/auth';

app.get('/auth/microsoft', (req, res) => {
  const authUrl = `${microsoftOAuthUrl}?client_id=${process.env.MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${process.env.MICROSOFT_REDIRECT_URI}&response_mode=query&scope=openid%20profile%20User.Read%20Calendars.Read`;
  res.redirect(authUrl);
});

app.get('/auth/spotify', (req, res) => {
  const authUrl = `${spotifyOAuthUrl}?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=user-read-private%20user-read-email%20user-modify-playback-state`;
  res.redirect(authUrl);
});

app.get('/auth/google', (req, res) => {
  const authUrl = `${googleOAuthUrl}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/calendar.readonly%20https://www.googleapis.com/auth/keep`;
  res.redirect(authUrl);
});

app.get('/auth/microsoft/callback', async (req, res) => {
  const code = req.query.code;
  const tokenResponse = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', null, {
    params: {
      client_id: process.env.MICROSOFT_CLIENT_ID,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  req.session.microsoftToken = tokenResponse.data.access_token;
  res.redirect('/main.html');
});

app.get('/auth/spotify/callback', async (req, res) => {
  const code = req.query.code;
  const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
    params: {
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  req.session.spotifyToken = tokenResponse.data.access_token;
  res.redirect('/main.html');
});

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
    params: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  req.session.googleToken = tokenResponse.data.access_token;
  res.redirect('/main.html');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
