import Cart from '../model/cart.model';
import _ from 'lodash';
import { isEmpty } from '../util/lang.utils';

/**
 * Find cart
 * @returns cart
 */
export const findCartByAccountId = async (
  accountId,
  projection = {},
  { populate = false } = {}
) => {
  let cart = {};
  let where = {};
  where = _.chain({
    accountId,
  })
    .omitBy(isEmpty)
    .value();
  // Mongoose.set("debug", true)
  let query = Cart.findOne(where, projection);
  if (populate) {
    query = query.populate('items');
    query = query.populate('archivedItems');
  }
  cart = await query.lean().exec();
  return cart;
};

/**
 * @returns cart
 * @description creates an new cart
 */
export const createCart = async ({ accountId, items = [] }) => {
  let input = _.chain({
    accountId,
    items,
  })
    .omitBy(_.isUndefined)
    .value();
  const cart = new Cart(input);
  return await cart.save();
};

/**
 * @requires _id
 * @returns cart
 * @description updates a cart
 */
export const addToCart = async (
  accountId,
  { items = [], archivedItems = [] } = {}
) => {
  const cart = await findCartByAccountId(accountId);
  if (isEmpty(cart)) {
    return await createCart({ accountId, items });
  }
  await Cart.findByIdAndUpdate(cart._id, {
    $set: {
      items: [...(cart.items || []), ...items],
      archivedItems: [...(cart.archivedItems || []), ...archivedItems],
    },
  })
    .lean()
    .exec();
  return await findCartById(cart._id, {}, { populate: true });
};

/**
 *
 * @param _id cart id
 * @param projection
 * @returns  cart
 */
export const findCartById = async (
  _id,
  projection = {},
  { populate = false } = {}
) => {
  let cart = {};
  if (_id) {
    let query = Cart.findById(_id, projection);
    if (populate) {
      query = query.populate('items');
      query = query.populate('archivedItems');
    }
    cart = await query.lean().exec();
  }
  return cart;
};
