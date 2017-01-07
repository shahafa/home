const mongoose = require('mongoose');

exports.connect = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI);

  mongoose.connection.on('open', () => {
    console.log('✨  Database connection established!');
  });

  mongoose.connection.on('error', () => {
    console.log('❗️  Database connection error. Please make sure MongoDB is running.');
    process.exit();
  });
};

exports.disconnect = () => {
  mongoose.connection.close(() => {
    console.log('⚡️  Database connection closed');
  });
};
