const jwt = require('jsonwebtoken');
const { errorResponse } = require('../lib/utils.js');

exports.authenticationIsRequired = (req, res, next) => {
  req.checkBody('token', 'Token cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json(errorResponse(400, 'Validation Failed', errors));
  }

  const token = req.body.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.json(errorResponse(401, 'Invalid Token'));
  }

  next();
};
