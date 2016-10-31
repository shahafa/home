/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
  id: { type: String, required: true, index: { unique: true } },
  date: { type: Date, required: true },
  parking: { type: String },
  elevator: { type: String },
  balcony: { type: String },
  renovated: { type: String },
  neighborhood: { type: String },
  street: { type: String },
  floor: { type: String },
  rooms: { type: String },
  meter: { type: String },
  entrance: { type: String },
  info_text: { type: String },
  price: { type: String },
}, { timestamps: true });

HomeSchema.statics.get = async function(homeId) {
  const home = await this.findOne({ id: homeId }).exec();
  if (!home) {
    return false;
  }

  return home;
};


HomeSchema.statics.add = async function(home) {
  const newHome = new this(home);
  await newHome.save();
};

module.exports = mongoose.model('Home', HomeSchema);
