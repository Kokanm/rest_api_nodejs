const request = require('supertest');
const { expectedStatus, expectedContentType, expectedPropertyAndType } = require('../helpers');

module.exports = (app, mockData) => {
    describe('POST /signup', () => {
        it(`expects to return 'invalid parameter type' message`, async () => {
            const res = await request(app)
                .post('/signup')
                .set('Accept', 'application/json')
                .send({
                    username: 2,
                    password: 1,
                    repeatPassword: 'newpassword',
                });

            expectedStatus(res.status, 400);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return 'fields missing' message`, async () => {
            const res = await request(app)
                .post('/signup')
                .set('Accept', 'application/json')
                .send({});

            expectedStatus(res.status, 400);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return 'invalid password' message`, async () => {
            const res = await request(app)
                .post('/signup')
                .set('Accept', 'application/json')
                .send({
                    username: 'NewUser',
                    password: 'newpassword',
                    repeatPassword: 'newpassword',
                });

            expectedStatus(res.status, 400);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return a 'user already exists' message`, async () => {
            const res = await request(app)
                .post('/signup')
                .set('Accept', 'application/json')
                .send({
                    username: 'user1',
                    password: mockData.validPassword,
                    repeatPassword: mockData.validPassword,
                });

            expectedStatus(res.status, 409);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it('expects to create a new user', async () => {
            const res = await request(app)
                .post('/signup')
                .set('Accept', 'application/json')
                .send({
                    username: 'NewUser',
                    password: mockData.validPassword,
                    repeatPassword: mockData.validPassword,
                });

            expectedStatus(res.status, 201);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });
    });

    describe('POST /login', () => {
        it(`expects to return 'invalid parameter type' message`, async () => {
            const res = await request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send({
                    username: 4,
                    password: mockData.validPassword,
                });

            expectedStatus(res.status, 400);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return a 'auth failed' message (because of non existing user)`, async () => {
            const res = await request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send({
                    username: 'NON_EXISTING_USERNAME',
                    password: mockData.validPassword,
                });

            expectedStatus(res.status, 401);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it(`expects to return a 'auth failed' message (because of invalid password)`, async () => {
            const res = await request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send({
                    username: 'NewUser',
                    password: 'INVALID_PASSWORD',
                });

            expectedStatus(res.status, 401);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
        });

        it('expects to login the user and return the JWT token', async () => {
            const res = await request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send({
                    username: 'NewUser',
                    password: mockData.validPassword,
                });

            expectedStatus(res.status, 200);
            expectedContentType(res.headers['content-type'], /json/);
            expectedPropertyAndType(res.body, 'message', 'string');
            expectedPropertyAndType(res.body, 'token', 'string');
        });
    });
};
