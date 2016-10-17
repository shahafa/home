const chalk = require('chalk');
const jwt = require('express-jwt');
const graphqlHTTP = require('express-graphql');
const testController = require('../controllers/test');
const userController = require('../controllers/user');
const homeSchema = require('../schema');

function routesConfig(app) {
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);

  app.get('/getTime', jwt({ secret: process.env.JWT_SECRET }), testController.getTime);
  app.use('/graphql', jwt({ secret: process.env.JWT_SECRET }), graphqlHTTP(request => ({
    schema: homeSchema,
    rootValue: { userid: request.user.userid },
    graphiql: true,
  })));

  console.log('%s Routes configured successfully', chalk.green('✓'));
}

module.exports = routesConfig;
