const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config/config.json');
const responses = require('../utils/responses');
const typeValidation = require('../utils/typeValidation');
const userDAL = require('../DAL/user');

module.exports = {
    signup: async function signup(req, res, next) {
        try {
            const { username, password, repeatPassword } = req.body;

            if (
                !typeValidation.isString(username) ||
                !typeValidation.isString(password) ||
                !typeValidation.isString(repeatPassword)
            ) {
                return res.status(400).json(responses.deny('Please enter the parameters with correct type.'));
            }

            if (!username || !username.trim() || !password || !repeatPassword) {
                return res.status(400).json(responses.deny('Please enter your username and password.'));
            }

            if (password !== repeatPassword) {
                return res
                    .status(400)
                    .json(responses.deny('Please make sure that the password and repeated password are equal.'));
            }

            if (username.length > 254) {
                return res.status(400).json(responses.deny('Username too long.'));
            }

            if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,254}$/.test(password)) {
                return res
                    .status(400)
                    .json(
                        responses.deny(
                            'Invalid password. It should contain minimum 8 characters,' +
                                'maximum 254 characters and at least one uppercase letter,' +
                                'one lowercase letter, one number and one special character'
                        )
                    );
            }

            // Searches for a user in the DB by unique username. The username check is case insesitive.
            // Ex: If a user has username: User1 => uSer1, USER1, useR1 are not allowed
            const userInDB = await userDAL.findByUniqueUsername(username);

            if (userInDB) {
                return res.status(409).json(responses.deny('Username already exists.'));
            } else {
                const hash = await bcrypt.hash(req.body.password, 10);
                await userDAL.saveUser({
                    username: req.body.username,
                    password: hash,
                    likes: [],
                });

                res.status(201).json(responses.success('The user was successfully created'));
            }
        } catch (err) {
            res.status(500).json(responses.error(err.message));
        }
    },

    login: async function login(req, res, next) {
        try {
            const { username, password } = req.body;

            if (!typeValidation.isString(username) || !typeValidation.isString(password)) {
                return res.status(400).json(responses.deny('Please enter the parameters with correct type.'));
            }

            if (!username || !username.trim() || !password) {
                return res.status(400).json(responses.deny('Please enter your username and password.'));
            }

            const user = await userDAL.findByUsername(username);
            if (!user) {
                return res.status(401).json(responses.deny('Auth failed'));
            }

            const compare = await bcrypt.compare(password, user.password);
            if (compare) {
                const token = jwt.sign(
                    {
                        userId: user._id,
                        username: user.username,
                    },
                    config.auth.JWT_KEY,
                    {
                        expiresIn: '1h',
                    }
                );

                return res.status(200).json(responses.success('Auth successful', { token }));
            }

            res.status(401).json(responses.deny('Auth failed'));
        } catch (err) {
            res.status(500).json(responses.error(err.message));
        }
    },
};
