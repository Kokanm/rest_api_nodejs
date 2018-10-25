const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config/config.json');
const app = require('../../app');
const User = mongoose.model.User || require('../models/user');
const authTest = require('./api-tests/auth.spec');
const profileTest = require('./api-tests/profile.spec');
const userTest = require('./api-tests/user.spec');

const mockValidPassword = '1Qwe@#zxc';
const hashedMockValidPassword = bcrypt.hashSync(mockValidPassword, 10);
const mockUsers = [
    {
        _id: new mongoose.Types.ObjectId(),
        username: 'User1',
        uniqueUsername: 'user1',
        password: hashedMockValidPassword,
        passwordModifiedAt: Date.now(),
    },
    {
        _id: new mongoose.Types.ObjectId(),
        username: 'User2',
        uniqueUsername: 'user2',
        password: hashedMockValidPassword,
        passwordModifiedAt: Date.now(),
    },
    {
        _id: new mongoose.Types.ObjectId(),
        username: 'User3',
        uniqueUsername: 'user3',
        password: hashedMockValidPassword,
        passwordModifiedAt: Date.now(),
    },
];

const mockTokens = [
    jwt.sign(
        {
            userId: mockUsers[0]._id,
            username: mockUsers[0].username,
        },
        config.auth.JWT_KEY,
        {
            expiresIn: '1h',
        }
    ),
    jwt.sign(
        {
            userId: mockUsers[1]._id,
            username: mockUsers[1].username,
        },
        config.auth.JWT_KEY,
        {
            expiresIn: '1h',
        }
    ),
    jwt.sign(
        {
            userId: mockUsers[2]._id,
            username: mockUsers[2].username,
        },
        config.auth.JWT_KEY,
        {
            expiresIn: '1h',
        }
    ),
];

const mockData = {
    validPassword: mockValidPassword,
    hashedValidPassword: hashedMockValidPassword,
    users: mockUsers,
    tokens: mockTokens,
};

describe('API TESTING', () => {
    before(async () => {
        try {
            await User.deleteMany({});
            await User.insertMany(mockUsers);
        } catch (error) {
            console.error(error);
        }
    });

    describe('AUTH API', () => {
        authTest(app, mockData);
    });

    describe('USER API', () => {
        userTest(app, mockData);
    });

    describe('PROFILE API', () => {
        profileTest(app, mockData);
    });

    after(async () => {
        await User.deleteMany({});
        return mongoose.disconnect(() => {
            mongoose.models = {};
            mongoose.modelSchemas = {};
            mongoose.connection.close();
        });
    });
});
