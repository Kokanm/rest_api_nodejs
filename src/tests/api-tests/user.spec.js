const request = require('supertest');
const mongoose = require('mongoose');
const {
    expectedStatus,
    expectedContentType,
    expectedPropertyAndType,
    expectedNestedPropertyAndType,
} = require('../helpers');

module.exports = (app, mockData) => {
    describe('GET /user/:id', () => {
        it(`expects to return a 'invalid objectID' error`, async () => {
            const res = await request(app)
                .get('/user/INVALID_OBJECTID')
                .set('Accept', 'application/json');

            expectedStatus(res.status, 500);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'error', 'string');
        });

        it(`expects to return a 'user not found' message`, async () => {
            const res = await request(app)
                .get(`/user/${new mongoose.Types.ObjectId()}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 404);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it('expects to return information about a user with given id', async () => {
            const res = await request(app)
                .get(`/user/${mockData.users[0]._id}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 200);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, '_id', 'string');
            expectedPropertyAndType(res.body, 'username', 'string');
            expectedPropertyAndType(res.body, 'likeCount', 'number');
            expectedPropertyAndType(res.body, 'likes', 'Array');
        });
    });

    describe('PUT /user/:id/like', () => {
        it(`expects to return 'user does not exist' message`, async () => {
            const res = await request(app)
                .put(`/user/${new mongoose.Types.ObjectId()}/like`)
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 404);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return 'You are a narcissist...' message`, async () => {
            const res = await request(app)
                .put(`/user/${mockData.users[1]._id}/like`)
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 406);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it('expects to successfully like the user', async () => {
            const res = await request(app)
                .put(`/user/${mockData.users[2]._id}/like`)
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 200);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
            expectedPropertyAndType(res.body, 'user', 'Object');
            expectedNestedPropertyAndType(res.body, 'user._id', 'string');
            expectedNestedPropertyAndType(res.body, 'user.username', 'string');
            expectedNestedPropertyAndType(res.body, 'user.likes', 'Array');
        });

        it(`expects 'user already liked' message`, async () => {
            const res = await request(app)
                .put(`/user/${mockData.users[2]._id}/like`)
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 202);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
            expectedPropertyAndType(res.body, 'user', 'Object');
            expectedNestedPropertyAndType(res.body, 'user._id', 'string');
            expectedNestedPropertyAndType(res.body, 'user.username', 'string');
        });
    });

    describe('PUT /user/:id/unlike', () => {
        it(`expects to return 'user does not exist' error`, async () => {
            const res = await request(app)
                .put(`/user/${new mongoose.Types.ObjectId()}/unlike`)
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 404);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return 'Why don't you like yourself?' message`, async () => {
            const res = await request(app)
                .put(`/user/${mockData.users[1]._id}/unlike`)
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 418);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to successfully unlike the user`, async () => {
            const res = await request(app)
                .put(`/user/${mockData.users[2]._id}/unlike`)
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 200);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
            expectedPropertyAndType(res.body, 'user', 'Object');
            expectedNestedPropertyAndType(res.body, 'user._id', 'string');
            expectedNestedPropertyAndType(res.body, 'user.username', 'string');
            expectedNestedPropertyAndType(res.body, 'user.likes', 'Array');
        });

        it(`expects to return 'can not like unliked user' message`, async () => {
            const res = await request(app)
                .put(`/user/${mockData.users[2]._id}/unlike`)
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 202);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
            expectedPropertyAndType(res.body, 'user', 'Object');
            expectedNestedPropertyAndType(res.body, 'user._id', 'string');
            expectedNestedPropertyAndType(res.body, 'user.username', 'string');
        });
    });

    describe('GET /most-liked', () => {
        it(`expects to return list of most liked users`, async () => {
            const res = await request(app)
                .get(`/most-liked`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 200);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'mostLikedUsers', 'Array');
            expectedNestedPropertyAndType(res.body, 'mostLikedUsers[0]._id', 'string');
            expectedNestedPropertyAndType(res.body, 'mostLikedUsers[0].username', 'string');
            expectedNestedPropertyAndType(res.body, 'mostLikedUsers[0].likeCount', 'number');
        });
    });
};
