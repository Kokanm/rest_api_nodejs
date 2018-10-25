const User = require('../models/user');

module.exports = {
    getAllUsers: function getAllUsers() {
        return User.find({}).exec();
    },
    saveUser: function saveUser(data) {
        const user = new User(data);

        return user.save();
    },
    findById: function findById(_id, populateWith = '') {
        return User.findById(_id)
            .populate(populateWith)
            .exec();
    },
    findByUsername: function findByUsername(username) {
        return User.findOne({ username }).exec();
    },
    findByUniqueUsername: function findByUniqueUsername(username) {
        return User.findOne({
            uniqueUsername: username.toLowerCase(),
        }).exec();
    },
    updateById: function updateUserById(_id, data) {
        return User.updateOne({ _id }, { $set: data }).exec();
    },
    addLike: function addLike(_id, likeId, populateWith = '') {
        return User.findOneAndUpdate({ _id }, { $addToSet: { likes: likeId } }, { new: true })
            .populate(populateWith)
            .exec();
    },
    removeLike: function removeLike(_id, unlikeId, populateWith = '') {
        return User.findOneAndUpdate({ _id }, { $pull: { likes: unlikeId } }, { new: true })
            .populate(populateWith)
            .exec();
    },
};
