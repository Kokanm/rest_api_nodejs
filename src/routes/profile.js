const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const { asyncErrorHandler } = require('../middleware/async-wrapper');
const ProfileController = require('../controllers/profile');

/**
 * Description - Returns information about the logged in user.
 * Authorization - required
 * Response - _id: string, username: string, likes: Array<{_id: string, username: string}>
 */
router.get('/me', checkAuth, asyncErrorHandler(ProfileController.profile));

/**
 * Description - Updates the password of the authorized user.
 * Authorization - required
 * Payload - oldPassword: string, newPassword: string, repeatPassword: string
 * Response - message: string
 */
router.put('/me/update-password', checkAuth, asyncErrorHandler(ProfileController.updatePassword));

module.exports = router;
