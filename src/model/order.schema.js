import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import Product from './product.model';

/**
 * _id === account._id
 */
const _orderSchema = Schema({
  accountId: {
    type: ObjectId,
    required: true,
    select: false,
  },
  items: {
    type: [ObjectId],
    required: true,
    ref: Product,
    localField: 'items',
    foreignField: '_id',
    default: [],
  },
  status: {
    type: String,
    default: 'requested',
    enum: ['requested', 'shipped', 'delivered', 'cancelled', 'archived'],
  },
  address: {
    type: String,
    required: true,
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

_orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const orderSchema = _orderSchema;
export default orderSchema;
