const configs = require('../configs/config');
const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Serialize and Deserialize User for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Use GoogleStrategy for OAuth 2.0 authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: configs.googleAuthClientId,
      clientSecret: configs.googleAuthClientSecret,
      callbackURL: configs.googleAuthServerCallbackURL, // Update with your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // If not, create a new user
          user = new User({
            email: profile.emails[0].value,
            username: profile.displayName,
            googleId: profile.id,
            profilePicture: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
