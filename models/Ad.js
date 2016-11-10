/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');
const moment = require('moment');

const QUERY_COUNT = 20;

const AdSchema = new mongoose.Schema({
  id: { type: String, required: true, index: { unique: true } },

  title: String,
  description: String,
  url: String,
  images: [String],

  price: [mongoose.Schema.Types.Mixed],

  floor: Number,
  rooms: Number,
  meter: Number,
  entrance: String,

  parking: Boolean,
  elevator: Boolean,
  balcony: Boolean,
  renovated: Boolean,

  neighborhood: String,
  street: String,
  street2: String,

  contactName: String,
  phone: String,

  priceChanged: { type: Boolean, default: false },
  isRelevant: { type: Boolean, default: true },
  new: { type: Boolean, default: true },
  comment: String,
}, { timestamps: true });

AdSchema.statics.get = async function(page) {
  const home = await this.find({}).skip(page * QUERY_COUNT).limit(QUERY_COUNT).exec();
  if (!home) {
    return false;
  }

  return home;
};

AdSchema.statics.getDayAds = async function(dayDate) {
  const ads = await this.find({
    updatedAt: {
      $gte: moment(dayDate).startOf('day'),
      $lte: moment(dayDate).endOf('day'),
    },
  }).exec();

  if (!ads) {
    return false;
  }

  return ads;
};

AdSchema.statics.add = async function(home) {
  const newHome = new this(home);
  await newHome.save();
};

module.exports = mongoose.model('Ad', AdSchema);
