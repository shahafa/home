const {
  GraphQLList,
} = require('graphql');

const User = require('../../models/User');
const UserType = require('../types/UserType.js');

const users = {
  type: new GraphQLList(UserType),
  resolve: () => User.getAll(),
};

module.exports = users;
