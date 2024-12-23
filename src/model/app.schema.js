import { Schema } from 'mongoose';
/**
 * _id === account._id
 */
const _appSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'deprecated'],
  },
  modules: {
    type: [String],
    default: ['./App'],
  },
  events: {
    type: Object,
    default: {},
  },
  env: {
    type: String,
    required: true,
    enum: ['development', 'production', 'test', 'staging'],
  },
  version: {
    type: String,
    default: '1.0.0',
  },
  description: {
    type: String,
  },
  dependencies: {
    type: Object,
    default: {},
  },
  devDependencies: {
    type: Object,
    default: {},
  },
  peerDependencies: {
    type: Object,
    default: {},
  },
  optionalDependencies: {
    type: Object,
    default: {},
  },
  homepage: {
    type: String,
  },
  author: {
    type: Object,
  },
  license: {
    type: String,
  },
  repository: {
    type: Object,
    default: {},
  },
  engines: {
    type: Object,
    default: {},
  },
  browserslist: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
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
// enforce composite index
_appSchema.index({ name: 1, url: 1, env: 1, version: 1 }, { unique: true });

export const appSchema = _appSchema;
