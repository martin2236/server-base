const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const { Usuario } = require('../../models');
const { Op } = require('sequelize');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// Estrategia Bearer (JWT tradicional)
passport.use(new BearerStrategy(async (token, done) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usuario.findByPk(decoded.id);

    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(null, false);
  }
}));

// Estrategia Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await Usuario.findOne({ where: { googleId: profile.id } });
    if (!user) {
      user = await Usuario.create({
        nombre: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        validado: true // ya está validado desde Google
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Estrategia Facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await Usuario.findOne({ where: { facebookId: profile.id } });
    if (!user) {
      user = await Usuario.create({
        nombre: profile.displayName,
        email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
        facebookId: profile.id,
        validado: true
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${process.env.HOST_API}/api/auth/linkedin/callback`,
    scope: ['r_liteprofile', 'r_emailaddress'],
    state: false
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // profile.emails[0].value sólo si pediste r_emailaddress
      const email = profile.emails?.[0]?.value || `${profile.id}@linkedin.com`;
  
      let user = await Usuario.findOne({
        where: {
          [Op.or]: [{ linkedinId: profile.id }, { correo: email }]
        }
      });
  
      if (!user) {
        user = await Usuario.create({
          nombre: profile.displayName,
          correo: email,
          linkedinId: profile.id,
          validado: true
        });
      }
  
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

module.exports = passport;
