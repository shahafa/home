const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');

const ads = require('./queries/ads.js');
const adsOfDay = require('./queries/adsOfDay.js');
const me = require('./queries/me.js');
const users = require('./queries/users.js');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'HomeAPI',
    description: 'Home API',
    fields: {
      ads,
      adsOfDay,
      me,
      users,
    },
  }),
});

module.exports = schema;
