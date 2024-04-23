const jwt = require('jsonwebtoken');
const express = require('express');
const passport = require('../Middleware/Passport');
const router = express.Router();
const User = require('../Model/User');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function (req, res) {
    res.redirect(process.env.URL_CLIENT);
});

router.get('/login-google', async (req, res) => {
    const id = req?.user?.id;

    if (id) {
        try {
            const response = await User.findOne({ googleId: id });
            const token =
                response &&
                jwt.sign(
                    { _id: response.id, role: response.role, email: response.email },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '7d',
                    },
                );
            return res.status(200).json({ success: true, message: 'login success', token });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Account login failed' });
        }
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error during logout' });
        }
        return res.redirect(process.env.URL_CLIENT);
    });
});

module.exports = router;
