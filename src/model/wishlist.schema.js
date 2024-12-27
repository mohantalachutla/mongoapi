import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import Product from './product.model';

/**
 * _id === account._id
 */
const _wishlistSchema = Schema({
  name: {
    type: String,
    required: true,
    lowerCase: true,
  },
  description: {
    type: String,
  },
  accountId: {
    type: ObjectId,
    required: true,
    select: false,
  },
  items: {
    type: [ObjectId],
    ref: Product,
    localField: 'items',
    foreignField: '_id',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

_wishlistSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
// enforce composite index
_wishlistSchema.index({ name: 1, accountId: 1 }, { unique: true });

const wishlistSchema = _wishlistSchema;
export default wishlistSchema;
