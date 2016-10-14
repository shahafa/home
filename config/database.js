const chalk = require('chalk');
const mongoose = require('mongoose');

exports.connect = () => {
  const connectPromise = new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URI);

    mongoose.connection.on('open', () => {
      console.log('%s Database connection established!', chalk.green('✓'));
      resolve(true);
    });

    mongoose.connection.on('error', () => {
      console.log('%s Database connection error. Please make sure MongoDB is running.', chalk.red('✗'));
      reject();
    });
  });

  return connectPromise;
};

exports.disconnect = () => {
  mongoose.connection.close();
};
