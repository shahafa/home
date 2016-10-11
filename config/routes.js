const testController = require('../controllers/test');

function routesConfig(app) {
  app.get('/getTime', testController.getTime);
}

module.exports = routesConfig;
