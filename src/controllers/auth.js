const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config/config.json');
const userDAL = require('../DAL/user');

module.exports = {
    signup: async function signup(req, res, next) {
        const { username, password, repeatPassword } = req.body;

        if (!username || !username.trim() || !password || !repeatPassword) {
            return res.status(400).json({
                message: 'Please enter your username and password.',
            });
        }

        if (password !== repeatPassword) {
            return res.status(400).json({
                message: 'Please make sure that the password and repeated password are equal.',
            });
        }

        if (username.length > 254) {
            return res.status(400).json({
                message: 'Username too long.',
            });
        }

        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,254}$/.test(password)) {
            return res.status(400).json({
                message: `Invalid password. It should contain minimum 8 characters, 
                  maximum 254 characters and at least one uppercase letter, one lowercase letter, 
                  one number and one special character`,
            });
        }

        // Searches for a user in the DB by unique username. The username check is case insesitive.
        // Ex: If a user has username: User1 => uSer1, USER1, useR1 are not allowed
        const userInDB = await userDAL.findByUniqueUsername(username);

        if (userInDB) {
            return res.status(409).json({
                message: 'Username already exists.',
            });
        } else {
            const hash = await bcrypt.hash(req.body.password, 10);
            await userDAL.saveUser({
                username: req.body.username,
                password: hash,
                likes: [],
            });

            res.status(201).json({
                message: 'The user was successfully created',
            });
        }
    },

    login: async function login(req, res, next) {
        const { username, password } = req.body;

        if (!username || !username.trim() || !password) {
            return res.status(400).json({
                message: 'Please enter your username and password.',
            });
        }

        const user = await userDAL.findByUsername(username);
        if (!user) {
            return res.status(401).json({
                message: 'Auth failed',
            });
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

            return res.status(200).json({
                message: 'Auth successful',
                token,
            });
        }

        res.status(401).json({
            message: 'Auth failed',
        });
    },
};
