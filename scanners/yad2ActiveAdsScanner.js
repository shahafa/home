/* eslint no-await-in-loop: "off" */
/* eslint no-continue: "off" */
/* eslint no-param-reassign: "off" */

require('dotenv').config();

const axios = require('axios');
const bunyan = require('bunyan');
const moment = require('moment');
const querystring = require('querystring');
const database = require('../config/database');
const Ad = require('../models/Ad');

const FEED_URL = 'https://app.yad2.co.il/api/v1.0/feed/feed.php';

const logger = bunyan.createLogger({
  name: 'Yad2Scanner',
  streams: [{
    level: 'info',
    path: `${process.env.LOG_FOLDER}/yad2ActiveAdsScanner.log`,
  }],
});

async function getTotalPages() {
  const res = await axios.post(FEED_URL,
    querystring.stringify({
      cat: 2,
      subcat: 2,
      sort: 1,
      page: 0,
      city: 1800,
    }));

  return res.data.data.total_pages;
}

async function getPage(page) {
  const res = await axios.post(FEED_URL,
    querystring.stringify({
      cat: 2,
      subcat: 2,
      sort: 1,
      page,
      city: 1800,
    }));

  return res.data.data.feed_items;
}

function getPriceValue(price) {
  if (price) {
    return parseInt(price.replace(/\D/g, ''), 10);
  }

  return undefined;
}

function getPriceObject(price) {
  return {
    price,
    date: new Date().toISOString(),
  };
}

async function scanAds() {
  let pageNumber = 0;
  const totalPages = await getTotalPages();
  const ads = {};

  do {
    pageNumber += 1;

    const page = await getPage(pageNumber);
    logger.info(`Downloading page ${pageNumber}/${totalPages}`);

    for (let i = 0; i < page.length; i += 1) {
      const ad = page[i];
      if (!ad.id) {
        continue;
      }

      ads[ad.id] = {
        date: ad.date,
        price: getPriceValue(ad.price),
      };
    }
  } while (pageNumber < totalPages);

  const ActiveAdsCursor = await Ad.findOne({ isActive: true }).cursor();
  await ActiveAdsCursor.eachAsync(async (adDocument) => {
    try {
      // if ad not found in map mark it as unActive
      if (!ads[adDocument.id]) {
        logger.info(`Ad ${adDocument.id} is not active anymore updating DB`);

        adDocument.isActive = false;
        adDocument.unActiveDate = Date.now();
        await adDocument.save();

      // if ad date is more than 5 days old mark it as unActive
      } else if (moment(ads[adDocument.id].date).diff(moment(), 'days') > 4) {
        logger.info(`Ad ${adDocument.id} is not active for 5 days updating DB`);

        adDocument.isActive = false;
        adDocument.unActiveDate = Date.now();
        await adDocument.save();

      // if price changed update DB
      } else if (adDocument.price !== ads[adDocument.id].price) {
        logger.info(`Ad ${adDocument.id} price changed from ${adDocument.price} to ${ads[adDocument.id].price}, updating DB`);

        adDocument.updatedAt = Date.now();
        adDocument.price = ads[adDocument.id].price;
        adDocument.priceHistory.push(getPriceObject(ads[adDocument.id].price));
        adDocument.priceChanged = true;
        adDocument.isRelevant = true;
        adDocument.adIsActive = true;

        await adDocument.save();
      }
    } catch (err) {
      logger.error(`Failed to update ad ${adDocument.id} (error: ${err})`);
    }
  });
}

async function scanYad2ActiveAds() {
  logger.info('Yad2 active ads scan started');
  console.log(`🚀  Yad2 active scan started, for more info see log file. (Start time: ${moment().toDate()})`);

  database.connect();

  await scanAds();

  database.disconnect();

  console.log(`👍  Yad2 active ads scan completed. (End time: ${moment().toDate()})`);
  logger.info('Yad2 active ads scan completed');
}

scanYad2ActiveAds();
