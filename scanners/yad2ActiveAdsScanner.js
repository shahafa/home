/* eslint no-param-reassign: "off" */

require('dotenv').config();

const axios = require('axios');
const bunyan = require('bunyan');
const database = require('../config/database');
const Ad = require('../models/Ad');

const AD_URL = 'https://app.yad2.co.il/api/v1.0/ad/ad.php?id=';
const UNACTIVE_STATUS = '404';

const logger = bunyan.createLogger({
  name: 'Yad2ActiveAdsScanner',
  streams: [{
    level: 'info',
    path: `${process.env.LOG_FOLDER}/yad2ActiveAdsScanner.log`,
  }],
});

async function scanActiveAds() {
  try {
    const ActiveAdsCursor = await Ad.findOne({ isActive: true }).cursor();

    await ActiveAdsCursor.eachAsync(async (adDocument) => {
      try {
        const res = await axios.post(`${AD_URL}${adDocument.id}`);

        if (res.data.status_code === UNACTIVE_STATUS) {
          logger.info(`Ad ${adDocument.id} is not active anymore updating DB`);

          adDocument.isActive = false;
          adDocument.unActiveDate = Date.now();
          await adDocument.save();
        }
      } catch (err) {
        logger.error(`Failed to scan active ad ${adDocument.id} (error: ${err})`);
      }
    });
  } catch (err) {
    logger.error(`Failed to scan active ads (error: ${err})`);
  }
}

async function scanYad2ActiveAds() {
  logger.info('Starting Yad2 Active Ads scan');
  console.log('🚀 Yad2 Active Ads scan started, for more info see log file');

  database.connect();

  await scanActiveAds();

  database.disconnect();

  console.log('👍 Yad2 Active Ads scan completed');
  logger.info('Yad2 Active Ads scan completed');
}

scanYad2ActiveAds();
