const express = require('express');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// Generate a session secret if not provided
const generateSessionSecret = () => {
  const secretPath = path.join(__dirname, '../.session_secret');
  if (!fs.existsSync(secretPath)) {
    const secret = crypto.randomBytes(64).toString('hex');
    fs.writeFileSync(secretPath, secret);
  }
  return fs.readFileSync(secretPath, 'utf8');
};

const sessionSecret = generateSessionSecret();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, (token, tokenSecret, profile, done) => {
  return done(null, profile);
}));

passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: "/api/auth/spotify/callback"
}, (accessToken, refreshToken, expires_in, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/keep'] }));

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/main.html');
  }
);

app.get('/api/auth/spotify', passport.authenticate('spotify', { scope: ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state'] }));

app.get('/api/auth/spotify/callback', 
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/main.html');
  }
);

module.exports = app;
