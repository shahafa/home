const jwt = require('jsonwebtoken');

exports.authenticationIsRequired = (req, res, next) => {
  const token = req.body.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.send('invalid token');
    return;
  }

  next();
};
