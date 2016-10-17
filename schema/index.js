// Import type helpers from graphql-js
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const User = require('../models/User');
const Apartment = require('../models/Apartment');

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

const ApartmentType = new GraphQLObjectType({
  name: 'Apartment',
  fields: () => ({
    userId: {
      type: GraphQLString,
    },
    city: {
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
    apartments: {
      type: new GraphQLList(ApartmentType),
      resolve: (post, args, context, { rootValue }) => Apartment.getById(rootValue.userid),
    },
  },
});

const homeSchema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: ...
});

module.exports = homeSchema;
