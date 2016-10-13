const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ERROR_VALIDATION_FAILED, ERROR_USER_ALLREADY_EXISTS,
        ERROR_INVALID_USERNAME_OR_PASSWORD, ERROR_SOMTHING_BAD_HAPPEND,
        getErrorObject } = require('../lib/errors.js');

function getUserToken(username, password) {
  return new Promise((fulfill, reject) => {
    User.findOne({ username }).exec()
    .then((user) => {
      // if user doesn't exists in DB
      if (user === null) {
        throw Error(ERROR_INVALID_USERNAME_OR_PASSWORD);
      }

      user.comparePassword(password, (error, passwordMatch) => {
        if (error) {
          throw Error(ERROR_SOMTHING_BAD_HAPPEND);
        }

        if (!passwordMatch) {
          throw Error(ERROR_INVALID_USERNAME_OR_PASSWORD);
        }

        const token = jwt.sign({
          userid: user._id, // eslint-disable-line
          user: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        fulfill(token);
      });
    })
    .catch((error) => {
      // Todo print error to log file
      reject(error);
    });
  });
}

exports.login = (req, res) => {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json(getErrorObject(ERROR_VALIDATION_FAILED, errors));
  }

  getUserToken(req.body.user, req.body.password)
  .then(token => res.json({
    message: 'Login successful',
    token,
  }))
  .catch(error => res.json(error));
};

function addUserToDatabse(newUser) {
  return new Promise((fulfill, reject) => {
    // Check if user allready exists
    User.findOne({ username: newUser.username }).exec()
    .then((user) => {
      if (user !== null) {
        throw Error(ERROR_USER_ALLREADY_EXISTS);
      }

      newUser.save((error) => {
        if (error) throw error;

        fulfill();
      });
    })
    .catch((error) => {
      // Todo print error to log file
      reject(error);
    });
  });
}

exports.signup = (req, res) => {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json(getErrorObject(ERROR_VALIDATION_FAILED, errors));
  }

  const newUser = new User({
    username: req.body.user,
    password: req.body.password,
  });

  addUserToDatabse(newUser)
  .then(() => res.json({ message: `User ${newUser.username} added successfully` }))
  .catch(error => res.json(error));
};
