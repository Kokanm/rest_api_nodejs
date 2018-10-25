const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const database = require('./src/db/database');

const { generalLimiter } = require('./src/utils/limiters');
const authRouter = require('./src/routes/auth');
const profileRouter = require('./src/routes/profile');
const userRouter = require('./src/routes/user');

database.connect();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
        return res.status(200).json({});
    }

    next();
});
app.use(generalLimiter);
app.disable('x-powered-by');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', userRouter);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: error.message,
    });
});

module.exports = app;
