import { Schema } from 'mongoose';
const { Buffer } = Schema.Types;

import { Activity } from './activity.model.js';

/**
 * _id === account._id
 */
const _accountSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: 'active',
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  displayName: {
    type: String,
  },
  displayPicture: {
    type: Buffer,
  },
  ssn: {
    type: String,
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

// Creating virtual field to populate activites
_accountSchema.virtual('activities', {
  ref: Activity, //Model name as string or class
  localField: '_id',
  foreignField: '_account',
});

_accountSchema.set('toObject', { virtuals: true });
_accountSchema.set('toJSON', { virtuals: true });

export const accountSchema = _accountSchema;
