import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import Product from './product.model';

/**
 * _id === account._id
 */
const _cartSchema = Schema({
  accountId: {
    type: ObjectId,
    required: true,
    unique: true,
    select: false,
  },
  items: {
    type: [ObjectId],
    ref: Product,
    localField: 'items',
    foreignField: '_id',
    default: [],
  },
  archivedItems: {
    type: [ObjectId],
    ref: Product,
    localField: 'archivedItems',
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

_cartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const cartSchema = _cartSchema;
export default cartSchema;
