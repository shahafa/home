const chalk = require('chalk');
const path = require('path');
const jwt = require('express-jwt');
const adsController = require('../controllers/ads');
const filterController = require('../controllers/filter');

const authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID,
});

function routesConfig(app) {
  app.use('/api/getApartments', authenticate, adsController.getAds);
  app.use('/api/addFilter', authenticate, filterController.addFilter);
  app.use('/api/getFilters', authenticate, filterController.getFilters);
  app.use('/api/deleteFilter', authenticate, filterController.deleteFilters);

  app.use('/', (req, res) => res.sendFile(path.join(__dirname, '/../public/index.html')));

  console.log('%s Routes configured successfully', chalk.green('✓'));
}

module.exports = routesConfig;
