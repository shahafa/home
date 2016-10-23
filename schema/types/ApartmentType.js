const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

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

module.exports = ApartmentType;
