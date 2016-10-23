const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');

const me = require('./queries/me.js');
const users = require('./queries/users.js');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'HomeAPI',
    description: 'Home API',
    fields: {
      me,
      users,
    },
  }),
});

module.exports = schema;
