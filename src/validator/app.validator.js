import joi from 'joi';
import { ValidationError } from '../error/common.error';

export const appValidator = joi.object({
  name: joi.string().required().error(new ValidationError('Invalid name')),
  url: joi.string().required().error(new ValidationError('Invalid URL')),
  modules: joi.array().error(new ValidationError('Invalid modules')),
  events: joi.object().error(new ValidationError('Invalid events')),
  status: joi.string().error(new ValidationError('Invalid status')),
  env: joi.string().required().error(new ValidationError('Invalid env')),
  version: joi.string().error(new ValidationError('Invalid version')),
  description: joi.string().error(new ValidationError('Invalid description')),
  dependencies: joi.object().error(new ValidationError('Invalid dependencies')),
  devDependencies: joi
    .object()
    .error(new ValidationError('Invalid devDependencies')),
  peerDependencies: joi
    .object()
    .error(new ValidationError('Invalid peerDependencies')),
  optionalDependencies: joi
    .object()
    .error(new ValidationError('Invalid optionalDependencies')),
  homepage: joi.string().error(new ValidationError('Invalid homepage')),
  author: joi.object().error(new ValidationError('Invalid author')),
  license: joi.string().error(new ValidationError('Invalid license')),
  repository: joi.object().error(new ValidationError('Invalid repository')),
  engines: joi.object().error(new ValidationError('Invalid engines')),
  browserslist: joi.array().error(new ValidationError('Invalid browserslist')),
  keywords: joi.array().error(new ValidationError('Invalid keywords')),
});
