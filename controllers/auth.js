const jwt = require('jsonwebtoken');
const { ERROR_VALIDATION_FAILED, ERROR_INVALID_TOKEN,
        getErrorObject } = require('../lib/errors.js');

exports.authenticationIsRequired = (req, res, next) => {
  req.checkBody('token', 'Token cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json(getErrorObject(ERROR_VALIDATION_FAILED, errors));
  }

  const token = req.body.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.json(getErrorObject(ERROR_INVALID_TOKEN, errors));
  }

  next();
};
