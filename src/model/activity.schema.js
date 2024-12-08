import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

/**
 * _id === activityId
 * _account === accountId
 */
export const activitySchema = new Schema({
  _account: {
    type: ObjectId,
    required: true,
    ref: 'Account',
  },
  activity: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  modelForRef: {
    type: String,
    required: true,
    enum: ['Job', 'JobTodo', 'Account', 'Transaction', 'Payment'],
  },
  _ref: {
    type: ObjectId,
    required: true,
    refPath: 'modelForRef',
  },
  createdAt: {
    type: Date,
    default: globalThis.Date.now(),
  },
  updatedAt: {
    type: Date,
    default: globalThis.Date.now(),
  },
});
