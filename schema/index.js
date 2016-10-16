// Import type helpers from graphql-js
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const User = require('../models/User');

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    username: {
      type: GraphQLString,
    },
  }),
});

// The root query type is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name: 'HomeAPI',
  description: 'Home API',

  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: () => User.getAll(),
    },
  },
});

const homeSchema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: ...
});

module.exports = homeSchema;
