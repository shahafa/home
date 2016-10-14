const jwt = require('jsonwebtoken');
const { Base64 } = require('js-base64');
const User = require('../models/User');
const { ERROR_VALIDATION_FAILED, ERROR_USER_ALLREADY_EXISTS,
        ERROR_INVALID_USERNAME_OR_PASSWORD, ERROR_SOMTHING_BAD_HAPPEND,
        ERROR_USER_NOT_FOUND } = require('../lib/errors.js');

function generateToken(username, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ username }).exec()
    .then((user) => {
      // if user doesn't exists in DB
      if (user === null) {
        reject(ERROR_INVALID_USERNAME_OR_PASSWORD);
        return;
      }

      user.comparePassword(password, (error, passwordMatch) => {
        if (error) {
          reject(ERROR_SOMTHING_BAD_HAPPEND);
          return;
        }

        if (!passwordMatch) {
          reject(ERROR_INVALID_USERNAME_OR_PASSWORD);
          return;
        }

        const token = jwt.sign({
          userid: user._id, // eslint-disable-line
          user: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        resolve(token);
      });
    })
    .catch(() => {
      // Todo print error to log file
      reject(ERROR_SOMTHING_BAD_HAPPEND);
    });
  });
}

function addUser(username, password) {
  return new Promise((resolve, reject) => {
    // Check if user allready exists
    User.findOne({ username }).exec()
    .then((user) => {
      if (user !== null) {
        reject(ERROR_USER_ALLREADY_EXISTS);
        return;
      }

      const newUser = new User({
        username,
        password,
      });

      newUser.save((error) => {
        if (error) throw error;

        resolve(true);
      });
    })
    .catch(() => {
      // Todo print error to log file
      reject(ERROR_SOMTHING_BAD_HAPPEND);
    });
  });
}

function deleteUser(username) {
  return new Promise((resolve, reject) => {
    // Check if user allready exists
    User.findOne({ username }).exec()
    .then((user) => {
      if (user === null) {
        reject(ERROR_USER_NOT_FOUND);
        return;
      }

      user.remove((error) => {
        if (error) throw error;

        resolve(true);
      });
    })
    .catch(() => {
      // Todo print error to log file
      reject(ERROR_SOMTHING_BAD_HAPPEND);
    });
  });
}

function login(req, res) {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const error = ERROR_VALIDATION_FAILED;
    error.errors = errors;
    return res.json(error);
  }

  const username = req.body.user;
  const password = Base64.decode(req.body.password);

  generateToken(username, password)
  .then(token => res.json({
    message: 'Login successful',
    token,
  }))
  .catch(error => res.json(error));
}

function signup(req, res) {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const error = ERROR_VALIDATION_FAILED;
    error.errors = errors;
    return res.json(error);
  }

  const username = req.body.user;
  const password = Base64.decode(req.body.password);

  addUser(username, password)
  .then(() => res.json({ message: `User ${req.body.user} added successfully` }))
  .catch(error => res.json(error));
}

module.exports = {
  generateToken,
  addUser,
  deleteUser,
  login,
  signup,
};
