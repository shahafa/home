/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');
const Ad = require('./Ad');

const FavoritesSchema = new mongoose.Schema({
  userId: String,
  favorites: Array,
}, {
  timestamps: true,
});

FavoritesSchema.statics.get = async function (userId) {
  const favoritesIds = (await this.findOne({ userId })).favorites;
  if (!favoritesIds || favoritesIds.length === 0) {
    return [];
  }

  const favorites = await Ad.find({ id: { $in: favoritesIds } }).exec();
  if (!favorites) {
    return [];
  }

  return favorites;
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