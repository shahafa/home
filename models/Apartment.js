/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');
const { ERROR_SOMTHING_BAD_HAPPEND } = require('../lib/errors.js');

const ApartmentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: { unique: true } },
  city: { type: String, required: true },
}, { timestamps: true });

ApartmentSchema.statics.getById = function(userId) {
  return new Promise((resolve, reject) => {
    console.log(userId);
    this.find({ userId }).exec()
    .then((apartments) => {
      resolve(apartments);
    }).catch((error) => {
      console.log(`Error: ${error}`);
      reject(ERROR_SOMTHING_BAD_HAPPEND);
    });
  });
};

module.exports = mongoose.model('Apartment', ApartmentSchema);
