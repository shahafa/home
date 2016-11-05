const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'home',
  streams: [{
    path: 'home.log',
  }],
});

module.exports = logger;
