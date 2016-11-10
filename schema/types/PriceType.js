const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const PriceType = new GraphQLObjectType({
  name: 'Price',
  fields: () => ({
    date: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
  }),
});

module.exports = PriceType;
