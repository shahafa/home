const jwt = require('jsonwebtoken');
const { ERROR_VALIDATION_FAILED, ERROR_INVALID_TOKEN } = require('../lib/errors.js');

exports.authenticationIsRequired = (req, res, next) => {
  req.checkBody('token', 'Token cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const error = ERROR_VALIDATION_FAILED;
    error.errors = errors;
    return res.json(error);
  }

  const token = req.body.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.json(ERROR_INVALID_TOKEN);
  }

  next();
};
