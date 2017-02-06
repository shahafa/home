require('dotenv').config();

const database = require('../config/database');
const Ad = require('../models/Ad');
const uuid = require('uuid/v4');

const adObject = {
  id: uuid(),

  title: 'ויצמן, הצפון החדש- צפון',
  description: 'בויצמן, ליד כיכר העפרונות, דירת 3 חדרים + מרפסת שמש אחרי תמ"א, משופצת גם מבפנים + 2 מזגנים, מעלית וקודן בבניין. מתאימה לזוג/ שותפים/ משפחה. הדירה כ-75 מ"ר, לא מרוהטת ארנונה 460 לחודשיים, שכר דירה 6700 ש"ח לפרטים נוספים בפרטי',
  url: 'https://www.facebook.com/groups/ApartmentsTelAviv/permalink/10154344717382194/',

  price: 7500,
  priceHistory: {
    price: 7500,
    date: new Date().toISOString(),
  },
  floor: 1,
  rooms: 3,
  meter: 75,
  tivuch: false,

  parking: false,
  elevator: true,
  balcony: true,
  renovated: true,

  neighborhood: 'הצפון הישן- צפון',
  street: 'ויצמן',
  street2: undefined,

  contactName: undefined,
  phone: undefined,
};

async function addNewAd() {
  database.connect();

  await Ad.add(adObject);

  database.disconnect();
}

addNewAd();
