import Product from '../model/product.model';
import _ from 'lodash';
import { isEmpty } from '../util/lang.utils';

/**
 *
 * @param {name: Name}
 * @param {type: Type}
 * @param {subtype: Subtype}
 * @param {status: Status}
 * @returns product
 */
export const findProduct = async (
  { name, type, subtype, status },
  projection = {}
) => {
  let product = {};
  let where = {};
  // Mongoose.set("debug", true)
  where = _.chain({
    name,
    type,
    subtype,
    status,
  })
    .omitBy(_.isUndefined)
    .value();
  if (!isEmpty(where)) {
    product = await Product.findOne(where, projection).lean().exec();
  }
  return product;
};

/**
 * Finds all products
 * @returns products
 */
export const findProducts = async (
  { name, type, subtype, status },
  projection = {}
) => {
  let products = [];
  let where = {};
  where = _.chain({
    name,
    type,
    subtype,
    status,
  })
    .omitBy(isEmpty)
    .value();
  // Mongoose.set("debug", true)
  products = await Product.find(where, projection).lean().exec();
  return products;
};

/**
 * @returns product
 * @description creates an new product
 */
export const createProduct = async ({
  name,
  description,
  type,
  subtype,
  totalItems,
  availableItems,
  rating,
  image,
  price,
}) => {
  const product = new Product(
    _.chain({
      name,
      description,
      type,
      subtype,
      totalItems,
      availableItems,
      rating,
      image,
      price,
    })
      .omitBy(_.isUndefined)
      .value()
  );
  return await product.save();
};

/**
 * @requires _id
 * @param name, url, modules, events
 * @returns product
 * @description creates an new product
 */
export const updateProduct = async (
  _id,
  {
    name,
    description,
    type,
    subtype,
    totalItems,
    availableItems,
    rating,
    image,
    price,
  }
) => {
  const input = _.chain({
    name,
    description,
    type,
    subtype,
    totalItems,
    availableItems,
    rating,
    image,
    price,
  })
    .omitBy(_.isUndefined)
    .value();
  return await Product.findByIdAndUpdate(_id, { $set: input }).lean().exec();
};

/**
 * @requires _id
 * @param _id, status
 * @returns product
 * @description creates an new product
 */
export const updateStatus = async ({ _id, status = 'inactive' }) => {
  return await Product.findByIdAndUpdate(_id, { $set: { status } })
    .lean()
    .exec();
};

/**
 * Deletes an product
 * @param {string} _id product id
 * @returns {Promise<MongoDB.Document | null>}
 * @description Deletes an product
 */
export const deleteProduct = async (_id) => {
  return await Product.findByIdAndDelete(_id).lean().exec();
};

/**
 *
 * @param _id product id
 * @param projection
 * @returns  product
 */
export const findProductById = async (_id, projection = {}) => {
  let product = {};
  if (_id) {
    product = await Product.findById(_id, projection).lean().exec();
  }
  return product;
};
