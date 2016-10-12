const { authenticationIsRequired } = require('../controllers/auth');
const testController = require('../controllers/test');
const userController = require('../controllers/user');

function routesConfig(app) {
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);
  app.post('/getTime', authenticationIsRequired, testController.getTime);
}

module.exports = routesConfig;
