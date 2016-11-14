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
  tivuch: Boolean,

  contactName: String,
  phone: String,

  priceChanged: { type: Boolean, default: false },
  isRelevant: { type: Boolean, default: true },
  new: { type: Boolean, default: true },
  comment: String,
}, { timestamps: true });

AdSchema.statics.get = async function(page) {
  const ads = await this.find({}).skip(page * QUERY_COUNT).limit(QUERY_COUNT).exec();
  if (!ads) {
    return false;
  }

  return ads;
};

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

AdSchema.statics.getAdsOfDay = async function(date) {
  const ads = await this.find({
    updatedAt: {
      $gte: moment(date).startOf('day'),
      $lte: moment(date).endOf('day'),
    },
  }).exec();

  if (!ads) {
    return false;
  }

  // await timeout(3000);

  return ads;
};

AdSchema.statics.add = async function(home) {
  const newHome = new this(home);
  await newHome.save();
};

module.exports = mongoose.model('Ad', AdSchema);
