/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  yad2LastScanTime: { type: Date },
}, { timestamps: true });

ConfigSchema.statics.getYad2LastScanTime = async function() {
  const config = await this.findOne().exec();
  if (config) {
    return config.yad2LastScanTime;
  }
};

ConfigSchema.statics.setYad2LastScanTime = async function(lastScanTime) {
  let config = await this.findOne().exec();
  if (config) {
    config.yad2LastScanTime = lastScanTime;
  } else {
    config = new this({
      yad2LastScanTime: lastScanTime,
    });
  }

  await config.save();
};

module.exports = mongoose.model('Config', ConfigSchema);
