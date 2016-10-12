const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = (req, res) => {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json({
      code: 400,
      message: 'Validation Failed',
      errors,
    });
  }

  User.findOne({ username: req.body.user }, (err, user) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        message: 'Something bad happened :(',
      });
      // Todo print error to log file
    }

    if (user === null) {
      return res.json({
        code: 401,
        message: 'Invalid username or password',
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          message: 'Something bad happened :(',
        });
        // Todo print error to log file
      }

      if (!isMatch) {
        return res.status(401).json({
          code: 401,
          message: 'Invalid username or password',
        });
      }

      const token = jwt.sign({
        user: user.username,
      }, process.env.JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        message: 'Login successful',
        token,
      });
    });
  });
};


exports.signup = (req, res) => {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json({
      code: 400,
      message: 'Validation Failed',
      errors,
    });
  }

  // Check if user allready exists
  User.findOne({ username: req.body.user }, (err, user) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        message: 'Something bad happened :(',
      });
      // Todo print error to log file
    }

    if (user !== null) {
      return res.json({
        message: 'User allready exists',
      });
    }

    const newUser = new User({
      username: req.body.user,
      password: req.body.password,
    });

    newUser.save((error) => {
      if (error) {
        return res.status(500).json({
          code: 500,
          message: 'Something bad happened :(',
        });
      }

      return res.json({
        message: `User ${newUser.username} added successfully`,
      });
    });
  });
};
