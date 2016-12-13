const Ad = require('../models/Ad');

async function getAds(req, res) {
  const date = req.body.date;

  const ads = await Ad.getAdsByDate(date);

  return res.json({
    status: 'success',
    data: {
      ads,
    },
  });
}

module.exports = {
  getAds,
};
