const testController = require('../controllers/test');
const userController = require('../controllers/user');

function routesConfig(app) {
  app.get('/getTime', testController.getTime);
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);
}

module.exports = routesConfig;
