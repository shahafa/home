const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');

const users = require('./queries/users.js');
const apartments = require('./queries/apartments.js');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'HomeAPI',
    description: 'Home API',
    fields: {
      users,
      apartments,
    },
  }),
});

module.exports = schema;
