/* eslint-disable no-restricted-syntax */

const Ad = require('../models/Ad');
const Filter = require('../models/Filter');

function buildFilterQuery(filter) {
  const queryFilter = {};
  if (filter.fromRooms !== null && filter.toRooms === null) {
    queryFilter.rooms = { $gte: filter.fromRooms };
  } else if (filter.fromRooms === null && filter.toRooms !== null) {
    queryFilter.rooms = { $lte: filter.toRooms };
  } else if (filter.fromRooms !== null && filter.toRooms !== null) {
    queryFilter.rooms = { $gte: filter.fromRooms, $lte: filter.toRooms };
  }

  if (filter.fromFloor !== null && filter.toFloor === null) {
    queryFilter.floor = { $gte: filter.fromFloor };
  } else if (filter.fromFloor === null && filter.toFloor !== null) {
    queryFilter.floor = { $lte: filter.toFloor };
  } else if (filter.fromFloor !== null && filter.toFloor !== null) {
    queryFilter.floor = { $gte: filter.fromFloor, $lte: filter.toFloor };
  }

  if (filter.fromPrice !== null && filter.toPrice === null) {
    queryFilter.price = { $gte: filter.fromPrice };
  } else if (filter.fromPrice === null && filter.toPrice !== null) {
    queryFilter.price = { $lte: filter.toPrice };
  } else if (filter.fromPrice !== null && filter.toPrice !== null) {
    queryFilter.price = { $gte: filter.fromPrice, $lte: filter.toPrice };
  }

  if (filter.renovated) {
    queryFilter.renovated = true;
  }

  if (filter.elevator) {
    queryFilter.elevator = true;
  }

  if (filter.parking) {
    queryFilter.parking = true;
  }

  return queryFilter;
}

async function getAds(req, res) {
  const date = req.body.date;
  const filterActive = req.body.filterActive;
  const userId = req.user.sub;

  let query = {};

  if (filterActive) {
    const filters = await Filter.getFilters(userId);
    if (filters.length === 1) {
      query = buildFilterQuery(filters[0].toObject());
    } else if (filters.length > 1) {
      const filterQuery = [];
      for (const filter of filters) {
        filterQuery.push(buildFilterQuery(filter.toObject()));
      }

      query = { $or: filterQuery };
    }
  }

  const ads = await Ad.getAdsByDate(date, query);

  return res.json({
    status: 'success',
    data: {
      ads,
    },
  });
}

module.exports = {
  getAds,
};
