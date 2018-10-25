const bcrypt = require('bcrypt');

const userDAL = require('../DAL/user');
const typeValidation = require('../utils/typeValidation');
const responses = require('../utils/responses');

module.exports = {
    profile: async function profile(req, res, next) {
        try {
            res.status(200).json(
                responses.success('Profile information', {
                    user: {
                        _id: req.user._id,
                        username: req.user.username,
                        likes: req.user.likes.map(like => {
                            return {
                                _id: like._id,
                                username: like.username,
                            };
                        }),
                    },
                })
            );
        } catch (err) {
            res.status(500).json(responses.error(err.message));
        }
    },

    updatePassword: async function updatePassword(req, res, next) {
        try {
            const { oldPassword, newPassword, repeatPassword } = req.body;

            if (
                !typeValidation.isString(oldPassword) ||
                !typeValidation.isString(newPassword) ||
                !typeValidation.isString(repeatPassword)
            ) {
                return res.status(400).json(responses.deny('Please enter the parameters with correct type.'));
            }

            if (!oldPassword || !newPassword || !repeatPassword) {
                return res.status(400).json(responses.deny('Please fill all of the fields.'));
            }

            if (newPassword !== repeatPassword) {
                return res
                    .status(400)
                    .json(responses.deny('Please make sure that the new password and repeated password are equal.'));
            }

            if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,254}$/.test(newPassword)) {
                return res
                    .status(400)
                    .json(
                        responses.deny(
                            'Invalid password. It should contain minimum 8 characters,' +
                                'maximum 254 characters and at least one uppercase letter, one lowercase letter,' +
                                'one number and one special character'
                        )
                    );
            }

            const user = await userDAL.findById(req.user._id);

            if (user) {
                const compare = await bcrypt.compare(oldPassword, user.password);
                if (!compare) {
                    return res.status(400).json(responses.deny('Please input the correct password.'));
                }

                const hash = await bcrypt.hash(newPassword, 10);
                await userDAL.updateById(req.user._id, {
                    password: hash,
                    passwordModifiedAt: Date.now(),
                });

                res.status(200).json(responses.success('The password was successfully updated.'));
            } else {
                res.status(404).json(responses.deny('A user with id ' + _id + ' does not exist'));
            }
        } catch (err) {
            res.status(500).json(responses.error(err.message));
        }
    },
};
