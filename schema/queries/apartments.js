const {
  GraphQLList,
} = require('graphql');

const Apartment = require('../../models/Apartment');
const ApartmentType = require('../types/ApartmentType.js');

const apartments = {
  type: new GraphQLList(ApartmentType),
  resolve: (post, args, context, { rootValue }) => Apartment.getById(rootValue.userid),
};

module.exports = apartments;
