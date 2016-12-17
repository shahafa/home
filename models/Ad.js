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

  priceHistory: [mongoose.Schema.Types.Mixed],

  price: Number,
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
  const ads = await this.find({})
                        .skip(page * QUERY_COUNT)
                        .limit(QUERY_COUNT)
                        .sort('-updatedAt')
                        .exec();
  if (!ads) {
    return false;
  }

  return ads;
};

AdSchema.statics.getAdsByDate = async function(date, filter = {}) {
  const queryFilter = Object.assign(filter, {
    updatedAt: {
      $gte: moment(date),
      $lt: moment(date).add(24, 'hours'),
    },
  });

  console.log(queryFilter);
  const ads = await this.find(queryFilter)
                        .sort('-updatedAt')
                        .exec();

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
