const request = require('supertest');
const {
    expectedStatus,
    expectedContentType,
    expectedPropertyAndType,
    expectedNestedPropertyAndType,
} = require('../helpers');

module.exports = (app, mockData) => {
    describe('GET /me', () => {
        it(`expects to return 'auth failed' message (because of no token)`, async () => {
            const res = await request(app)
                .get('/me')
                .set('Accept', 'application/json');

            expectedStatus(res.status, 401);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it('expects to return information about the logged in user', async () => {
            const res = await request(app)
                .get('/me')
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json');

            expectedStatus(res.status, 200);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'user', 'Object');
            expectedNestedPropertyAndType(res.body, 'user._id', 'string');
            expectedNestedPropertyAndType(res.body, 'user.username', 'string');
            expectedNestedPropertyAndType(res.body, 'user.likes', 'Array');
        });
    });

    describe('PUT /me/update-password', () => {
        it(`expects to return 'invalid parameter types' message`, async () => {
            const res = await request(app)
                .put('/me/update-password')
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json')
                .send({
                    oldPassword: 1,
                    newPassword: 2,
                    repeatPassword: '2raER$#cz',
                });

            expectedStatus(res.status, 400);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return 'missing fields' message`, async () => {
            const res = await request(app)
                .put('/me/update-password')
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json')
                .send({});

            expectedStatus(res.status, 400);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return 'incorrect old password' message`, async () => {
            const res = await request(app)
                .put('/me/update-password')
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json')
                .send({
                    oldPassword: 'INVALID_PASSWORD',
                    newPassword: '1qwER$#cx',
                    repeatPassword: '1qwER$#cx',
                });

            expectedStatus(res.status, 400);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return 'new and repeat password are not equal' message`, async () => {
            const res = await request(app)
                .put('/me/update-password')
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json')
                .send({
                    oldPassword: mockData.validPassword,
                    newPassword: '1qwER$#cx',
                    repeatPassword: '2raER$#cz',
                });

            expectedStatus(res.status, 400);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return 'password succesfully updated' message`, async () => {
            const res = await request(app)
                .put('/me/update-password')
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json')
                .send({
                    oldPassword: mockData.validPassword,
                    newPassword: '2raER$#cz',
                    repeatPassword: '2raER$#cz',
                });

            expectedStatus(res.status, 200);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return 'auth failed' message`, async () => {
            const res = await request(app)
                .put('/me/update-password')
                .set('Authorization', `Bearer ${mockData.tokens[1]}`)
                .set('Accept', 'application/json')
                .send({
                    oldPassword: mockData.validPassword,
                    newPassword: '2raER$#cz',
                    repeatPassword: '2raER$#cz',
                });

            expectedStatus(res.status, 401);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });
    });
};
