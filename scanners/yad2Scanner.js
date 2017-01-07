require('dotenv').config();

const axios = require('axios');
const bunyan = require('bunyan');
const moment = require('moment');
const querystring = require('querystring');
const database = require('../config/database');
const Ad = require('../models/Ad');
const Config = require('../models/Config');

const CONTACT_INFO_URL = 'https://app.yad2.co.il/api/v1.0/ad/contactinfo.php?id=';
const AD_URL = 'https://app.yad2.co.il/api/v1.0/ad/ad.php?id=';
const FEED_URL = 'https://app.yad2.co.il/api/v1.0/feed/feed.php';

const logger = bunyan.createLogger({
  name: 'Yad2Scanner',
  streams: [{
    level: 'info',
    path: `${process.env.LOG_FOLDER}/yad2Scanner.log`,
  }],
});

let lastScanTime;

async function getContactInfo(id) {
  const res = await axios.post(`${CONTACT_INFO_URL}${id}`);

  return res.data.data;
}

async function getAd(id) {
  const res = await axios.post(`${AD_URL}${id}`);

  return res.data.data;
}

async function getPage(page) {
  logger.info(`Downloading page ${page}.`);

  const res = await axios.post(FEED_URL,
    querystring.stringify({
      cat: 2,
      subcat: 2,
      sort: 1,
      page,
      city: 1800,
    })
  );

  return res.data.data.feed_items;
}

function getMediaValue(adDetails, key) {
  if (!adDetails.media) return undefined;

  if (!adDetails.media.params) return undefined;

  return adDetails.media.params[key] ? adDetails.media.params[key] : undefined;
}

function getAdditionalInfoValue(adDetails, key) {
  if (!adDetails.additional_info_items_v2) return undefined;

  const item = adDetails.additional_info_items_v2.find(i => i.key === key);
  return item ? item.value : undefined;
}

function getImportantInfoValue(adDetails, key) {
  if (!adDetails.important_info_items) return undefined;

  const item = adDetails.important_info_items.find(i => i.key === key);
  return item ? item.value : undefined;
}

function getPriceValue(adDetails) {
  const price = getMediaValue(adDetails, 'fromPrice');
  if (price) {
    return parseInt(price, 10);
  }

  return undefined;
}

function getPriceObject(adDetails) {
  const price = getMediaValue(adDetails, 'fromPrice');
  if (price) {
    return {
      price: parseInt(price, 10),
      date: new Date().toISOString(),
    };
  }

  return undefined;
}

function getAdObject(ad, adDetails, contactInfo) {
  const contactPhone = contactInfo.menu_items ? contactInfo.menu_items : undefined;

  return {
    id: ad.id,

    title: adDetails.second_title ? adDetails.second_title : undefined,
    description: adDetails.info_text ? adDetails.info_text : undefined,
    url: adDetails.canonical_url ? adDetails.canonical_url : undefined,
    images: adDetails.images ? adDetails.images : undefined,

    price: getPriceValue(adDetails),
    priceHistory: getPriceObject(adDetails),
    floor: getMediaValue(adDetails, 'FromFloor'),
    rooms: getMediaValue(adDetails, 'fromRooms'),
    meter: getMediaValue(adDetails, 'FromSquareMeter'),
    tivuch: getMediaValue(adDetails, 'tivuch') === 'yes',

    parking: getAdditionalInfoValue(adDetails, 'parking'),
    elevator: getAdditionalInfoValue(adDetails, 'elevator'),
    balcony: getAdditionalInfoValue(adDetails, 'balcony'),
    renovated: getAdditionalInfoValue(adDetails, 'renovated'),

    neighborhood: getImportantInfoValue(adDetails, 'שכונה'),
    street: getImportantInfoValue(adDetails, 'רחוב'),
    street2: ad.title_2 ? ad.title_2 : undefined,
    entrance: getImportantInfoValue(adDetails, 'entrance'),

    contactName: contactInfo.title ? contactInfo.title.replace('איש הקשר: ', '') : undefined,
    phone: contactPhone[0].link ? contactPhone[0].link.replace('tel:', '') : undefined,
  };
}

async function parseAd(ad) {
  const adId = ad.id;
  if (!adId) {
    logger.warn(`Ad does not contain ID skipping ad. Ad: ${JSON.stringify(ad)}`);
    return;
  }

  const adDetails = await getAd(ad.id);

  // if ad found in db check if price changed
  const adDocument = await Ad.get(adId);
  if (adDocument) {
    logger.info(`Ad ${ad.id} allready in DB`);

    const adDetailsPrice = 0; // getPriceValue(adDetails);
    if (adDocument.price !== adDetailsPrice) {
      logger.info(`Ad ${ad.id} price changed updating DB`);

      adDocument.updatedAt = Date.now();
      adDocument.price = adDetailsPrice;
      adDocument.priceHistory.push(getPriceObject(adDetails));
      adDocument.priceChanged = true;
      adDocument.isRelevant = true;
      adDocument.adIsActive = true;

      await adDocument.save();
    }
  } else {
    const contactInfo = await getContactInfo(ad.id);

    const adObject = getAdObject(ad, adDetails, contactInfo);

    logger.info(`New ad found. Addding ad ${ad.id} to Database`);

    await Ad.add(adObject);
  }
}

async function scanAds() {
  let pageNumber = 0;
  let continueToNextPage = true;

  do {
    pageNumber += 1;

    const page = await getPage(pageNumber);

    for (let i = 0; i < page.length; i += 1) {
      const ad = page[i];

      if (ad.date) {
        if (moment(ad.date).isBefore(lastScanTime)) {
          logger.info(`Ad ${ad.id} date is before last scan time stoping scan. Ad Date: ${ad.date}`);
          continueToNextPage = false;
          break;
        }
      }

      try {
        await parseAd(ad);
      } catch (e) {
        logger.warn(`Failed to parse Ad ${ad.id} moving to next one. ${e}`);
      }
    }
  } while (continueToNextPage);
}

async function scanYad2() {
  logger.info('Yad2 scan started');
  console.log('Yad2 scan started, for more info see log file');

  database.connect();

  lastScanTime = await Config.getYad2LastScanTime();
  await Config.setYad2LastScanTime(Date());

  logger.info(`Yad2 scan - last scan time: ${lastScanTime}`);

  await scanAds();

  database.disconnect();

  console.log('Yad2 scan completed');
  logger.info('Yad2 scan completed');
}

scanYad2();
