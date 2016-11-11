const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
} = require('graphql');

const PriceType = require('./PriceType');

const AdType = new GraphQLObjectType({
  name: 'Ad',
  description: 'an Ad',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    floor: {
      type: GraphQLInt,
    },
    rooms: {
      type: GraphQLInt,
    },
    meter: {
      type: GraphQLInt,
    },
    entrance: {
      type: GraphQLString,
    },
    parking: {
      type: GraphQLBoolean,
    },
    elevator: {
      type: GraphQLBoolean,
    },
    balcony: {
      type: GraphQLBoolean,
    },
    renovated: {
      type: GraphQLBoolean,
    },
    neighborhood: {
      type: GraphQLString,
    },
    street: {
      type: GraphQLString,
    },
    street2: {
      type: GraphQLString,
    },
    tivuch: {
      type: GraphQLBoolean,
    },
    contactName: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
    priceChanged: {
      type: GraphQLBoolean,
    },
    isRelevant: {
      type: GraphQLBoolean,
    },
    comment: {
      type: GraphQLString,
    },
    price: {
      type: new GraphQLList(PriceType),
    },
    images: {
      type: new GraphQLList(GraphQLString),
    },
    updatedAt: {
      type: GraphQLString,
    },
  }),
});

module.exports = AdType;
