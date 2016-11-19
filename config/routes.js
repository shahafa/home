const chalk = require('chalk');
const jwt = require('express-jwt');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');

const authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID,
});

function routesConfig(app) {
  app.use('/graphql', authenticate, graphqlHTTP(request => ({
    schema,
    rootValue: { userid: request.user.userid },
    graphiql: true,
  })));

  console.log('%s Routes configured successfully', chalk.green('✓'));
}

module.exports = routesConfig;
