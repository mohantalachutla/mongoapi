import express from 'express';
import _ from 'lodash';
import {
  createOrder,
  findOrderById,
  findOrders,
  updateStatus,
} from '../service/order.service';
import { orderValidator } from '../validator/order.validator';
import { ApiResponse } from '../model/common/ApiResponse';
import { DBError } from '../error/common.error';

const orderRouter = express.Router();

/**
 * @description browse orders
 * @param status Status
 * @returns ApiResponse
 */
orderRouter.post('/browse', async (req, res, next) => {
  const { fields } = req;

  try {
    const { accountId, status } = fields;
    try {
      let orders = await findOrders(
        {
          accountId,
          status,
        },
        {},
        { populate: true }
      );
      return next(new ApiResponse(orders, 200, ''));
    } catch {
      throw new DBError('Cannot Browse orders');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description finds a order
 * @param status Status
 * @returns ApiResponse
 */
orderRouter.get('/', async (req, res, next) => {
  const { params } = req;
  try {
    const { _id } = params;
    try {
      let order = await findOrderById(_id);
      return next(new ApiResponse(order, 200, ''));
    } catch {
      throw new DBError('Cannot find order');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description creates a order
 * @returns ApiResponse
 */
orderRouter.post('/', async (req, res, next) => {
  let order = {};
  const { fields } = req;
  fields.accountId = req.user._id;
  try {
    const input = await orderValidator.validateAsync(fields);

    try {
      order = await createOrder(_.chain(input).omitBy(_.isUndefined).value());
    } catch (err) {
      console.error(err);
      throw new DBError('Cannot create order');
    }
    return next(new ApiResponse(order, 200, ''));
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
orderRouter.put('/changeStatus', async (req, res, next) => {
  const { fields } = req;
  const { _id, status } = fields;
  let order = {};
  try {
    order = await updateStatus({ _id, status });
    return next(new ApiResponse(order, 200, ''));
  } catch {
    next(new DBError('Cannot change status'));
  }
});

export { orderRouter };
