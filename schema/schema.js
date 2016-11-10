const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');

const ads = require('./queries/ads.js');
const me = require('./queries/me.js');
const users = require('./queries/users.js');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'HomeAPI',
    description: 'Home API',
    fields: {
      ads,
      me,
      users,
    },
  }),
});

module.exports = schema;
