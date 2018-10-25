const jwt = require('jsonwebtoken');
const userDAL = require('../DAL/user');
const responses = require('../utils/responses');
const config = require('../config/config.json');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, config.auth.JWT_KEY);
        const user = await userDAL.findById(decoded.userId, 'likes');

        // The iat property of the decoded JWT token is in seconds that's why we have to
        // convert it to miliseconds before comparing.
        if (Date.parse(user.passwordModifiedAt) <= decoded.iat * 1000) {
            req.user = {
                _id: user._id.toString(),
                username: user.username,
                likes: user.likes.map(like => {
                    return {
                        _id: like._id,
                        username: like.username,
                    };
                }),
            };
            next();
        } else {
            return res.status(401).json(responses.deny('Auth failed'));
        }
    } catch (err) {
        return res.status(401).json(responses.deny('Auth failed'));
    }
};
