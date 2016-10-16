const chalk = require('chalk');
const graphqlHTTP = require('express-graphql');
const { authenticationIsRequired } = require('../controllers/auth');
const testController = require('../controllers/test');
const userController = require('../controllers/user');
const homeSchema = require('../schema');

function routesConfig(app) {
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);
  app.post('/getTime', authenticationIsRequired, testController.getTime);

  app.use('/graphql', graphqlHTTP({
    schema: homeSchema,
    rootValue: root,
    graphiql: true,
  }));

  console.log('%s Routes configured successfully', chalk.green('✓'));
}

module.exports = routesConfig;
