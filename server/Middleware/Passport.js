const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Model/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.YOUR_GOOGLE_CLIENT_ID,
            clientSecret: process.env.YOUR_GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await User.findOne({ googleId: profile.id });
            if (!user) {
                const newUser = new User({
                    googleId: profile.id,
                    firstname: profile.name.familyName,
                    lastname: profile.name.givenName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    password: '345345634ax6767657',
                });
                await newUser.save();
            }
            done(null, profile);
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
