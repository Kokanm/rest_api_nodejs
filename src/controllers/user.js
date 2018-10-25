const userDAL = require('../DAL/user');

module.exports = {
    userLook: async function userLook(req, res, next) {
        const _id = req.params.id;
        const user = await userDAL.findById(_id, 'likes');

        if (user) {
            res.status(200).json({
                _id: user._id,
                username: user.username,
                likeCount: user.likes.length,
                likes: user.likes.map(like => {
                    return {
                        _id: like._id,
                        username: like.username,
                    };
                }),
            });
        } else {
            res.status(404).json({
                message: 'There is no user with id: ' + _id,
            });
        }
    },

    userLike: async function userLike(req, res, next) {
        const _id = req.params.id;
        const likeId = req.user._id;

        if (_id === likeId) {
            res.status(406).json({
                message: 'You are a narcissist...',
            });
        } else {
            const user = await userDAL.findById(_id);

            if (user) {
                // It checks if a user is already liked. If not we add the like.
                if (user.likes.indexOf(likeId) >= 0) {
                    return res.status(202).json({
                        message: 'User was already liked',
                        user: {
                            _id: user._id,
                            username: user.username,
                        },
                    });
                } else {
                    const likedUserResult = await userDAL.addLike(_id, likeId, 'likes');
                    return res.status(200).json({
                        message: 'User successfully liked',
                        user: {
                            _id: likedUserResult._id,
                            username: likedUserResult.username,
                            likes: likedUserResult.likes.map(like => {
                                return {
                                    _id: like._id,
                                    username: like.username,
                                };
                            }),
                        },
                    });
                }
            } else {
                res.status(404).json({ message: 'A user with id ' + _id + ' does not exist' });
            }
        }
    },

    userUnlike: async function userUnlike(req, res, next) {
        const _id = req.params.id;
        const unlikeId = req.user._id;

        if (_id == unlikeId) {
            res.status(418).json({
                message: "Why don't you like yourself?",
            });
        } else {
            const user = await userDAL.findById(_id);

            if (user) {
                // It checks if a user is already liked. If it is we unlike him.
                if (user.likes.indexOf(unlikeId) < 0) {
                    return res.status(202).json({
                        message: 'Cannot unlike user that is not liked',
                        user: {
                            _id: user._id,
                            username: user.username,
                        },
                    });
                } else {
                    const unlikedUserResult = await userDAL.removeLike(_id, unlikeId, 'likes');
                    return res.status(200).json({
                        message: 'User successfully unliked',
                        user: {
                            _id: unlikedUserResult._id,
                            username: unlikedUserResult.username,
                            likes: unlikedUserResult.likes.map(like => {
                                return {
                                    _id: like._id,
                                    username: like.username,
                                };
                            }),
                        },
                    });
                }
            } else {
                res.status(404).json({ message: 'A user with id ' + _id + ' does not exist' });
            }
        }
    },

    mostLikedUsers: async function mostLikedUsers(req, res, next) {
        const users = await userDAL.getAllUsers();

        // Sorts users from most liked to least liked
        const usersSortedByNumberOfLikes = users.sort((a, b) => {
            if (a.likes.length > b.likes.length) {
                return -1;
            } else if (a.likes.length < b.likes.length) {
                return 1;
            }

            return 0;
        });

        res.status(200).json({
            mostLikedUsers: usersSortedByNumberOfLikes.map(user => {
                return {
                    _id: user._id,
                    username: user.username,
                    likeCount: user.likes.length,
                };
            }),
        });
    },
};
