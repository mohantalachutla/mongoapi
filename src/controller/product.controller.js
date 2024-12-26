import express from 'express';
import _ from 'lodash';
import {
  createProduct,
  findProduct,
  findProducts,
  updateProduct,
  updateStatus,
} from '../service/product.service';
import { productValidator } from '../validator/product.validator';
import { ApiResponse } from '../model/common/ApiResponse';
import { DBError } from '../error/common.error';

const productRouter = express.Router();

/**
 * @description browse products
 * @param status Status
 * @returns ApiResponse
 */
productRouter.post('/browse', async (req, res, next) => {
  const { fields } = req;

  try {
    const { name, type, subtype, status } = fields;
    try {
      let products = await findProducts({
        name,
        type,
        subtype,
        status,
      });
      return next(new ApiResponse(products, 200, ''));
    } catch {
      throw new DBError('Cannot Browse Products');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description finds a product
 * @param status Status
 * @returns ApiResponse
 */
productRouter.post('/find', async (req, res, next) => {
  const { fields } = req;

  try {
    const { name, type, subtype, status } = fields;
    try {
      let products = await findProduct({
        name,
        type,
        subtype,
        status,
      });
      return next(new ApiResponse(products, 200, ''));
    } catch {
      throw new DBError('Cannot Browse Products');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description creates a product
 * @returns ApiResponse
 */
productRouter.post('/create', async (req, res, next) => {
  let product = {};
  const { fields } = req;

  try {
    const input = await productValidator.validateAsync(fields);
    try {
      product = await createProduct(
        _.chain(input).omitBy(_.isUndefined).value()
      );
    } catch {
      throw new DBError('Cannot create product');
    }
    return next(new ApiResponse(product, 200, ''));
  } catch (err) {
    next(err);
  }
});

/**
 * @description changes status
 * @requires _id, status
 * @param _id Id
 * @param status Status
 * @returns ApiResponse
 */
productRouter.post('/changeStatus', async (req, res, next) => {
  const { fields } = req;
  const { _id, status } = fields;
  let product = {};
  try {
    product = await updateStatus({ _id, status });
    return next(new ApiResponse(product, 200, ''));
  } catch {
    next(new DBError('Cannot change status'));
  }
});

/**
 * @description updates a product
 * @requires _id
 * @returns ApiResponse
 */
productRouter.post('/update', async (req, res, next) => {
  const { fields } = req;

  try {
    const input = await productValidator.validateAsync(fields);
    let product = {};
    const { _id, ...rest } = input;

    try {
      product = await updateProduct(_id, rest);
      return next(new ApiResponse(product, 200, ''));
    } catch {
      throw new DBError('Product not found');
    }
  } catch (err) {
    next(err);
  }
});

export { productRouter };
