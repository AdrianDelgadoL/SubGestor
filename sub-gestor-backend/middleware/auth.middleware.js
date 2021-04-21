const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    if(!token) res.status(401).json({msg: "Unauthorized user"});

    try {
        const decodedToken = jwt.verify(token, config.get('jwtSecret'));
        req.userId = decoded;
        next();
    } catch (e) {
        res.status(400).json({msg: "Bad token"});
    }
}

module.exports = auth;