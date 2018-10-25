const rateLimit = require('express-rate-limit');

module.exports = {
  generalLimiter: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res, next) => {
      res.status(429).json({
        message:
          'Too many requests from this IP, please try again after 15 minutes.',
      });
    },
  }),
  signupLimiter: rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    handler: (req, res, next) => {
      res.status(429).json({
        message:
          'Too many accounts created from this IP, please try again after an hour.',
      });
    },
  }),
  loginLimiter: rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    handler: (req, res, next) => {
      res.status(429).json({
        message:
          'Too many login attempts from this IP, please try again after 5 minutes.',
      });
    },
  }),
};
