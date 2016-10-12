const util = require('util');
const User = require('../models/User');

exports.login = (req, res) => {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const errorsString = util.inspect(errors);
    res.send(`Error: ${errorsString}`);
    return;
  }

  User.findOne({ username: req.body.user }, (err, user) => {
    if (err) throw err;

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) throw err;

      if (isMatch) {
        res.send('Login successful');
      } else {
        res.send('Login failed');
      }
    });
  });
};

exports.signup = (req, res) => {
  req.checkBody('user', 'User cannot be blank').notEmpty();
  req.checkBody('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const errorsString = util.inspect(errors);
    res.send(`Error: ${errorsString}`);
    return;
  }

  const user = new User({
    username: req.body.user,
    password: req.body.password,
  });

  user.save((error) => {
    if (error) {
      res.send('failure');
      return;
    }

    res.send(`User ${user.name} added successfully`);
  });
};
