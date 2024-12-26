import { Schema } from 'mongoose';
const { Buffer } = Schema.Types;

/**
 * _id === account._id
 */
const _productSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'book',
      'electronic',
      'footwear',
      'clothing',
      'appliance',
      'furniture',
      'grocery',
      'other',
    ],
  },
  subtype: {
    type: String,
  },
  status: {
    type: String,
    default: 'commingsoon',
    enum: ['instock', 'outofstock', 'comingsoon', 'fewleft', 'newarrival'],
  },
  totalItems: {
    type: Number,
    min: 0,
    default: 0,
  },
  availableItems: {
    type: Number,
    min: 0,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  image: {
    type: Buffer,
  },
  price: {
    type: Number,
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
// enforce composite index
_productSchema.index({ name: 1, type: 1 }, { unique: true });
const productSchema = _productSchema;
export default productSchema;
