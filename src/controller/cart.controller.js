import express from 'express';
import {
  addToCart,
  createCart,
  findCartByAccountId,
  findCartById,
} from '../service/cart.service';
import { cartValidator } from '../validator/cart.validator';
import { ApiResponse } from '../model/common/ApiResponse';
import { DBError } from '../error/common.error';
import { isEmpty } from '../util/lang.utils';

const cartRouter = express.Router();

/**
 * @description finds a cart
 * @param status Status
 * @returns ApiResponse
 */
cartRouter.get('/', async (req, res, next) => {
  const { params } = req;

  try {
    const { _id } = params;
    try {
      let cart = isEmpty(_id)
        ? await findCartByAccountId(req.user._id)
        : await findCartById(_id);
      if (isEmpty(cart)) {
        cart = await createCart({ accountId: req.user._id });
      }
      cart = await findCartByAccountId(req.user._id, {}, { populate: true });
      return next(new ApiResponse(cart, 200, ''));
    } catch {
      throw new DBError('Cannot find cart');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description updates a cart
 * @requires _id
 * @returns ApiResponse
 */
cartRouter.post('/', async (req, res, next) => {
  const { fields } = req;
  const accountId = req.user._id;
  try {
    const input = await cartValidator.validateAsync({ ...fields, accountId });
    let cart = {};
    try {
      cart = await addToCart(accountId, input);
      return next(new ApiResponse(cart, 200, ''));
    } catch {
      throw new DBError('Cannot update cart');
    }
  } catch (err) {
    next(err);
  }
});

export { cartRouter };
