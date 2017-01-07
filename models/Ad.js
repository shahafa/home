/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  id: { type: String, required: true, index: { unique: true } },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

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
  isActive: { type: Boolean, default: true },
  unActiveDate: Date,
});


AdSchema.statics.get = async function(homeId) {
  const home = await this.findOne({ id: homeId }).exec();
  if (!home) {
    return false;
  }

  return home;
};

AdSchema.statics.add = async function(home) {
  const newHome = new this(home);
  await newHome.save();
};

module.exports = mongoose.model('Ad', AdSchema);
