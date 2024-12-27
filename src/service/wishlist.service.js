import Wishlist from '../model/wishlist.model';
import _ from 'lodash';
import { isEmpty } from '../util/lang.utils';

/**
 * Finds all wishlists
 * @returns wishlists
 */
export const findWishlists = async (
  { name, accountId },
  projection = {},
  { populate = false } = {}
) => {
  let wishlists = [];
  let where = {};
  where = _.chain({
    name,
    accountId,
  })
    .omitBy(isEmpty)
    .value();
  // Mongoose.set("debug", true)
  let query = Wishlist.find(where, projection);
  if (populate) {
    query = query.populate('items');
  }
  wishlists = await query.lean().exec();
  return wishlists;
};

/**
 * @returns wishlist
 * @description creates an new wishlist
 */
export const createWishlist = async ({
  name,
  description,
  accountId,
  items = [],
}) => {
  let input = _.chain({
    name,
    description,
    accountId,
    items,
  })
    .omitBy(_.isUndefined)
    .value();
  const wishlist = new Wishlist(input);
  return await wishlist.save();
};

/**
 * @requires _id
 * @param name, url, modules, events
 * @returns wishlist
 * @description updates an new wishlist
 */
export const updateWishlist = async (_id, { description, items }) => {
  const input = _.chain({
    description,
    items,
  })
    .omitBy(_.isUndefined)
    .value();
  const wishlist = await findWishlistById(_id);
  if (isEmpty(wishlist)) {
    throw new Error('Wishlist not found');
  }
  await Wishlist.findByIdAndUpdate(_id, {
    $set: input,
  })
    .lean()
    .exec();
  return await findWishlistById(_id);
};

/**
 * Deletes an wishlist
 * @param {string} _id wishlist id
 * @returns {Promise<MongoDB.Document | null>}
 * @description Deletes an wishlist
 */
export const deleteWishlist = async (_id) => {
  return await Wishlist.findByIdAndDelete(_id).lean().exec();
};

/**
 *
 * @param _id wishlist id
 * @param projection
 * @returns  wishlist
 */
export const findWishlistById = async (_id, projection = {}) => {
  let wishlist = {};
  if (_id) {
    wishlist = await Wishlist.findById(_id, projection).lean().exec();
  }
  return wishlist;
};
