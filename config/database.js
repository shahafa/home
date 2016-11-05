const chalk = require('chalk');
const mongoose = require('mongoose');

exports.connect = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI);

  mongoose.connection.on('open', () => {
    console.log('%s Database connection established!', chalk.green('✓'));
  });

  mongoose.connection.on('error', () => {
    console.log('%s Database connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });
};

exports.disconnect = () => {
  mongoose.connection.close(() => {
    console.log('%s Database connection closed', chalk.blue('!'));
  });
};
