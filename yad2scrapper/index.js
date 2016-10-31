require('dotenv').config();

const axios = require('axios');
const moment = require('moment');
const querystring = require('querystring');
const Home = require('../models/Home');
const Config = require('../models/Config');
const database = require('../config/database');

let lastScanTime;

async function getAd(id) {
  const res = await axios.post(`https://app.yad2.co.il/api/v1.0/ad/ad.php?id=${id}`);

  return res.data.data;
}

async function getPage(page) {
  const res = await axios.post('https://app.yad2.co.il/api/v1.0/feed/feed.php',
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

async function parseAd(ad) {
  const homeId = ad.id;
  if (!homeId) return;

  const adDetails = await getAd(ad.id);
  const home = await Home.get(homeId);

  // if home found in db
  if (home) return;

  console.log('new home found');

  const newHome = {
    id: ad.id,
    date: Date(),
    parking: adDetails.additional_info_items_v2.find(item => item.key === 'parking').value,
    elevator: adDetails.additional_info_items_v2.find(item => item.key === 'elevator').value,
    balcony: adDetails.additional_info_items_v2.find(item => item.key === 'balcony').value,
    renovated: adDetails.additional_info_items_v2.find(item => item.key === 'renovated').value,
    neighborhood: adDetails.important_info_items.find(item => item.key === 'שכונה').value,
    street: adDetails.important_info_items.find(item => item.key === 'רחוב').value,
    floor: adDetails.media.FromFloor,
    rooms: adDetails.media.fromRooms,
    meter: adDetails.media.FromSquareMeter,
    entrance: adDetails.info_bar_items.find(item => item.key === 'entrance').value,
    info_text: adDetails.info_text,
    price: adDetails.media.fromPrice,
    tivuch: adDetails.media.tivuch,
  };

  await Home.add(newHome);
}

async function scanAds() {
  let pageNumber = 0;
  let continueToNextPage = false;

  do {
    pageNumber += 1;
    continueToNextPage = false;

    console.log(pageNumber); // TODO: Remove

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

async function main() {
  database.connect();

  lastScanTime = await Config.getYad2LastScanTime();
  await Config.setYad2LastScanTime(Date());

  await scanAds();

  database.disconnect();
}

main();
