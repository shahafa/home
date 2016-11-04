require('dotenv').config();

const axios = require('axios');
const moment = require('moment');
const querystring = require('querystring');
const Ad = require('../models/Ad');
const Config = require('../models/Config');
const database = require('../config/database');

const CONTACT_INFO_URL = 'https://app.yad2.co.il/api/v1.0/ad/contactinfo.php?id=';
const AD_URL = 'https://app.yad2.co.il/api/v1.0/ad/ad.php?id=';
const FEED_URL = 'https://app.yad2.co.il/api/v1.0/feed/feed.php';

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

function getPriceObject(adDetails) {
  const price = getMediaValue(adDetails, 'fromPrice');
  if (price) {
    return {
      price,
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

    price: getPriceObject(adDetails),
    floor: getMediaValue(adDetails, 'FromFloor'),
    rooms: getMediaValue(adDetails, 'fromRooms'),
    meter: getMediaValue(adDetails, 'FromSquareMeter'),
    tivuch: getMediaValue(adDetails, 'tivuch'),

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

function priceChanged(adDocument, adDetails) {
  const priceObject = getPriceObject(adDetails);
  const price = adDocument.price[adDocument.price.length - 1].price;

  return price !== priceObject.price;
}

async function parseAd(ad) {
  const adId = ad.id;
  if (!adId) return;

  const adDetails = await getAd(ad.id);

  // if ad found in db check if price changed
  const adDocument = await Ad.get(adId);
  if (adDocument) {
    if (priceChanged(adDocument, adDetails)) {
      adDocument.price.push(getPriceObject(adDetails));
      adDocument.priceChanged = true;
      adDocument.isRelevant = true;

      await adDocument.save();
    }
  } else {
    const contactInfo = await getContactInfo(ad.id);

    await Ad.add(getAdObject(ad, adDetails, contactInfo));
  }
}

async function scanAds() {
  let pageNumber = 0;
  let continueToNextPage = false;

  do {
    pageNumber += 1;
    continueToNextPage = false;

    const page = await getPage(pageNumber);
    for (let i = 0; i < page.length; i += 1) {
      const ad = page[i];

      if (ad.date) {
        if (moment(ad.date).isBefore(lastScanTime)) {
          continueToNextPage = false;
        }
      }

      await parseAd(ad);
    }
  } while (continueToNextPage);
}

async function yad2Scan() {
  database.connect();

  lastScanTime = await Config.getYad2LastScanTime();
  await Config.setYad2LastScanTime(Date());

  await scanAds();

  database.disconnect();
}

module.exports = yad2Scan;
