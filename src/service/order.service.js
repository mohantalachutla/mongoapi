import Order from '../model/order.model';
import _ from 'lodash';
import { isEmpty } from '../util/lang.utils';

/**
 * Finds all orders
 * @returns orders
 */
export const findOrders = async (
  { accountId, status },
  projection = {},
  { populate = false } = {}
) => {
  let orders = [];
  let where = {};
  where = _.chain({
    accountId,
    status,
  })
    .omitBy(isEmpty)
    .value();
  // Mongoose.set("debug", true)
  let query = Order.find(where, projection);
  if (populate) {
    query = query.populate('items');
  }
  orders = await query.lean().exec();
  return orders;
};

/**
 * @returns order
 * @description creates an new order
 */
export const createOrder = async ({
  accountId,
  items = [],
  address,
  status,
}) => {
  let input = _.chain({
    accountId,
    items,
    address,
    status,
  })
    .omitBy(_.isUndefined)
    .value();
  const order = new Order(input);
  return await order.save();
};

/**
 * @requires _id
 * @param _id, status
 * @returns order
 * @description creates an new order
 */
export const updateStatus = async ({ _id, status = 'cancelled' }) => {
  await Order.findByIdAndUpdate(_id, { $set: { status } }).lean().exec();
  return await findOrderById(_id);
};

/**
 *
 * @param _id order id
 * @param projection
 * @returns  order
 */
export const findOrderById = async (_id, projection = {}) => {
  let order = {};
  if (_id) {
    order = await Order.findById(_id, projection).lean().exec();
  }
  return order;
};
