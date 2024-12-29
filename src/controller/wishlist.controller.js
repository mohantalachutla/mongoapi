import express from 'express';
import _ from 'lodash';
import {
  createWishlist,
  deleteWishlist,
  findWishlistById,
  findWishlists,
  updateWishlist,
} from '../service/wishlist.service';
import { wishlistValidator } from '../validator/wishlist.validator';
import { ApiResponse } from '../model/common/ApiResponse';
import { DBError } from '../error/common.error';
import { isEmpty } from '../util/lang.utils';

const wishlistRouter = express.Router();

/**
 * @description browse wishlists
 * @param status Status
 * @returns ApiResponse
 */
wishlistRouter.post('/browse', async (req, res, next) => {
  const { fields } = req;

  try {
    const { name, accountId } = fields;
    try {
      let wishlists = await findWishlists(
        {
          name,
          accountId,
        },
        {},
        { populate: true }
      );
      return next(new ApiResponse(wishlists, 200, ''));
    } catch {
      throw new DBError('Cannot Browse wishlists');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description finds a wishlist
 * @param status Status
 * @returns ApiResponse
 */
wishlistRouter.get('/', async (req, res, next) => {
  const { params } = req;

  try {
    const { _id } = params;
    try {
      let wishlist = await findWishlistById(_id);
      return next(new ApiResponse(wishlist, 200, ''));
    } catch {
      throw new DBError('Cannot find wishlist');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description creates a wishlist
 * @returns ApiResponse
 */
wishlistRouter.post('/', async (req, res, next) => {
  let wishlist = {};
  const { fields } = req;
  if (isEmpty(fields?.name)) {
    fields.name = 'Wishlist';
  }
  fields.accountId = req.user._id;
  console.log('fields', fields);
  try {
    const input = await wishlistValidator.validateAsync(fields);
    const wishlists = await findWishlists(input);
    if (!isEmpty(wishlists)) {
      wishlist = await updateWishlist(wishlists[0]._id, input);
      return next(new ApiResponse(wishlist, 200, ''));
    }
    try {
      wishlist = await createWishlist(
        _.chain(input).omitBy(_.isUndefined).value()
      );
    } catch (err) {
      console.error(err);
      throw new DBError('Cannot create wishlist');
    }
    return next(new ApiResponse(wishlist, 200, ''));
  } catch (err) {
    next(err);
  }
});

/**
 * @description updates a wishlist
 * @requires _id
 * @returns ApiResponse
 */
wishlistRouter.put('/', async (req, res, next) => {
  const { fields } = req;

  try {
    const input = await wishlistValidator.validateAsync(fields);
    let wishlist = {};
    const { _id, ...rest } = input;
    delete rest.accountId;
    try {
      wishlist = await updateWishlist(_id, rest);
      return next(new ApiResponse(wishlist, 200, ''));
    } catch {
      throw new DBError('Wishlist not found');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description deletes a wishlist
 * @requires _id
 * @returns ApiResponse
 */
wishlistRouter.delete('/:_id', async (req, res, next) => {
  const { params } = req;

  const { _id } = params;
  try {
    try {
      await deleteWishlist(_id);
      return next(new ApiResponse({}, 200, ''));
    } catch {
      throw new DBError('Wishlist not found');
    }
  } catch (err) {
    next(err);
  }
});

export { wishlistRouter };
