const Favorites = require('../models/Favorites');

async function get(req, res) {
  const userId = req.user.sub;

  const favorites = await Favorites.get(userId);

  return res.json({
    status: 'success',
    data: {
      userId,
      favorites,
    },
  });
}

async function add(req, res) {
  const userId = req.user.sub;
  const favoriteId = req.body.favoriteId;

  await Favorites.add(userId, favoriteId);

  return res.json({
    status: 'success',
    data: null,
  });
}

async function remove(req, res) {
  const userId = req.user.sub;
  const favoriteId = req.body.favoriteId;

  await Favorites.remove(userId, favoriteId);

  return res.json({
    status: 'success',
    data: null,
  });
}

module.exports = {
  get,
  add,
  remove,
};
