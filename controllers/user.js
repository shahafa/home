const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../lib/utils.js');

exports.login = (req, res) => {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json(errorResponse(400, 'Validation Failed', errors));
  }

  User.findOne({ username: req.body.user }).exec()
  .then((user) => {
    // if user doesn't exists in DB
    if (user === null) {
      return res.json(errorResponse(401, 'Invalid username or password'));
    }

    user.comparePassword(req.body.password, (error, passwordMatch) => {
      if (error) throw error;

      if (!passwordMatch) {
        return res.status(401).json(errorResponse(401, 'Invalid username or password'));
      }

      const token = jwt.sign({
        user: user.username,
      }, process.env.JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        message: 'Login successful',
        token,
      });
    });
  })
  .catch(() => {
    // Todo print error to log file
    res.json(errorResponse(500, 'Something bad happened :('));
  });
};


exports.signup = (req, res) => {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json(errorResponse(400, 'Validation Failed', errors));
  }

  // Check if user allready exists
  User.findOne({ username: req.body.user }).exec()
  .then((user) => {
    if (user !== null) {
      return res.json(errorResponse(400, 'User allready exists'));
    }

    const newUser = new User({
      username: req.body.user,
      password: req.body.password,
    });

    newUser.save((error) => {
      if (error) throw error;

      return res.json({
        message: `User ${newUser.username} added successfully`,
      });
    });
  })
  .catch(() => {
    // Todo print error to log file
    res.json(errorResponse(500, 'Something bad happened :('));
  });
};
