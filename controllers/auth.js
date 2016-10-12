const jwt = require('jsonwebtoken');

exports.authenticationIsRequired = (req, res, next) => {
  req.checkBody('token', 'Token cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json({
      code: 400,
      message: 'Validation Failed',
      errors,
    });
  }

  const token = req.body.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid token',
    });
  }

  next();
};
