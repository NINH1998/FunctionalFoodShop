const jwt = require('jsonwebtoken');

const verifyAccessToken = async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decode) => {
            if (error) {
                return res.status(400).json({ message: 'invalid' });
            }

            req.user = decode;
            next();
        });
    } else {
        return res.status(400).json({ success: false, message: 'Required access token' });
    }
};

const isAdmin = async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'enikk') return res.status(400).json({ success: false, message: 'Requires admin access' });
    next();
};

module.exports = { verifyAccessToken, isAdmin };
