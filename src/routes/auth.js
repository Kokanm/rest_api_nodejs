const express = require('express');
const router = express.Router();

const { signupLimiter, loginLimiter } = require('../middleware/limiters');
const { asyncErrorHandler } = require('../middleware/async-wrapper');
const AuthController = require('../controllers/auth');

/**
 * Description - Registers a user.
 * Payload - username: string, password: string, repeatPassword: string
 * Response - message: string
 */
router.post('/signup', signupLimiter, asyncErrorHandler(AuthController.signup));

/**
 * Description - Logs in a user.
 * Payload - username: string, password: string
 * Response - message: string, token: string
 */
router.post('/login', loginLimiter, asyncErrorHandler(AuthController.login));

module.exports = router;
