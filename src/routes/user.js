const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const { asyncErrorHandler } = require('../middleware/async-wrapper');
const UserController = require('../controllers/user');

/**
 * Description - Returns information about a user.
 * Request - id: string
 * Response - _id: string, username: string, likeCount: number, likes: Array<{_id: string, username: string}>
 */
router.get('/user/:id', asyncErrorHandler(UserController.userLook));

/**
 * Description - Likes a user.
 * Authorization - required
 * Request - id: string
 * Response - message: string, user: {_id: string, username: string, likes: Array<{_id: string, username: string}>}
 */
router.put('/user/:id/like', checkAuth, asyncErrorHandler(UserController.userLike));

/**
 * Description - Unlikes a user.
 * Authorization - required
 * Request - id: string
 * Response - message: string, user: {_id: string, username: string, likes: Array<{_id: string, username: string}>}
 */
router.put('/user/:id/unlike', checkAuth, asyncErrorHandler(UserController.userUnlike));

/**
 * Description - Returns all users ordered from most liked to least liked.
 * Request - id: string
 * Response - mostLikedUsers: Array<{_id: string, username: string, likeCount: number}>
 */
router.get('/most-liked', asyncErrorHandler(UserController.mostLikedUsers));

module.exports = router;
