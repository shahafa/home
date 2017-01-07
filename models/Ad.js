/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');
const moment = require('moment');

const AdSchema = new mongoose.Schema({
  id: { type: String, required: true, index: { unique: true } },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now, index: true },

  title: String,
  description: String,
  url: String,
  images: [String],

  priceHistory: [mongoose.Schema.Types.Mixed],

  price: { type: Number, index: true },
  floor: { type: Number, index: true },
  rooms: { type: Number, index: true },
  meter: Number,
  entrance: String,

  parking: { type: Boolean, index: true },
  elevator: { type: Boolean, index: true },
  balcony: Boolean,
  renovated: { type: Boolean, index: true },

  neighborhood: String,
  street: String,
  street2: String,
  tivuch: Boolean,

  contactName: String,
  phone: String,

  priceChanged: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true, index: true },
  unActiveDate: Date,
});


AdSchema.statics.get = async function(homeId) {
  const home = await this.findOne({ id: homeId }).exec();
  if (!home) {
    return false;
  }

  return home;
};

AdSchema.statics.getAdsByDate = async function(date, filter = {}) {
  const queryFilter = Object.assign(filter, {
    updatedAt: {
      $gte: moment(date),
      $lt: moment(date).add(24, 'hours'),
    },
  });

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
