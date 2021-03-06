/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');
const Ad = require('./Ad');

const FavoritesSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  favorites: Array,
}, {
  timestamps: true,
});

FavoritesSchema.statics.get = async function (userId) {
  const favoritesObject = await this.findOne({ userId });
  if (!favoritesObject) {
    return [];
  }

  const favoritesList = favoritesObject.favorites;
  if (!favoritesList || favoritesList.length === 0) {
    return [];
  }

  const favoritesAds = await Ad.find({ id: { $in: favoritesList } })
                            .sort('-updatedAt')
                            .exec();
  if (!favoritesAds) {
    return [];
  }

  return favoritesAds;
};

FavoritesSchema.statics.add = async function (userId, favoriteId) {
  const favorites = await this.findOne({ userId }).exec();
  if (!favorites) {
    const favoritesObject = new this({
      userId,
      favorites: [favoriteId],
    });

    await favoritesObject.save();
    return true;
  } else if (favorites.favorites.includes(favoriteId)) {
    return false;
  }

  favorites.favorites.push(favoriteId);
  await favorites.save();
  return true;
};

FavoritesSchema.statics.remove = async function (userId, favoriteId) {
  const favorites = await this.findOne({ userId }).exec();
  if (!favorites || !favorites.favorites.includes(favoriteId)) {
    return false;
  }

  const index = favorites.favorites.indexOf(favoriteId);
  if (index === -1) return false;

  favorites.favorites.splice(index, 1);

  await favorites.save();

  return true;
};

module.exports = mongoose.model('Favorite', FavoritesSchema);
