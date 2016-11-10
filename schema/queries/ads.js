const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
} = require('graphql');
const Ad = require('../../models/Ad');
const AdType = require('../types/AdType.js');

const ads = {
  type: new GraphQLList(AdType),
  args: {
    page: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: (obj, args) => Ad.get(args.page),
};

module.exports = ads;
