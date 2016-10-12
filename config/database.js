const chalk = require('chalk');
const mongoose = require('mongoose');

function databaseConfig() {
  /**
   * Connect to MongoDB.
   */
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI);
  mongoose.connection.on('connected', () => {
    console.log('%s MongoDB connection established!', chalk.green('✓'));
  });
  mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });
}

module.exports = databaseConfig;
