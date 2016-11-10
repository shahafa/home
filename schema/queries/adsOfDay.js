const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} = require('graphql');
const Ad = require('../../models/Ad');
const AdType = require('../types/AdType.js');

const ads = {
  type: new GraphQLList(AdType),
  args: {
    day: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (obj, args) => Ad.getAdsOfDay(args.day),
};

module.exports = ads;
