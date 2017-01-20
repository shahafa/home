/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');

const FilterSchema = new mongoose.Schema({
  neighborhood: String,
  fromRooms: Number,
  toRooms: Number,
  fromFloor: Number,
  toFloor: Number,
  fromPrice: Number,
  toPrice: Number,
  renovated: Boolean,
  elevator: Boolean,
  parking: Boolean,
  userId: { type: String, index: true },
}, { timestamps: true });

FilterSchema.statics.add = async function(filter) {
  const newFilter = new this(filter);
  await newFilter.save();

  return newFilter;
};

FilterSchema.statics.get = async function(filterId) {
  const filter = await this.findOne({ _id: filterId }).exec();
  if (!filter) {
    return false;
  }

  return filter;
};

FilterSchema.statics.getFilters = async function(userId) {
  const filters = await this.find({ userId }).exec();
  if (!filters) {
    return false;
  }

  return filters;
};

FilterSchema.statics.delete = async function(userId, filterId) {
  const filter = await this.findOne({ _id: filterId }).exec();
  if (!filter || filter.userId !== userId) {
    return false;
  }

  await filter.remove();
  return true;
};

module.exports = mongoose.model('Filter', FilterSchema);
