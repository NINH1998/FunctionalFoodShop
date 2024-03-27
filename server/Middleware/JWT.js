const jwt = require('jsonwebtoken');

const Accesstoken = (userId, role) => {
    return jwt.sign({ _id: userId, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
};

const Refreshtoken = (userId) => jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '365d' });

module.exports = { Accesstoken, Refreshtoken };
