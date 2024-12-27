import joi from 'joi';
import { ValidationError } from '../error/common.error';
import { isMongoId } from '../util/common.util';

export const wishlistValidator = joi.object({
  name: joi.string().required().error(new ValidationError('Invalid name')),
  description: joi.string().error(new ValidationError('Invalid description')),
  accountId: joi
    .custom((value) => isMongoId(value) && value)
    .required()
    .error(new ValidationError('Invalid accountId')),
  items: joi
    .custom((value) => Array.isArray(value) && value.map(isMongoId) && value)
    .error(new ValidationError('Invalid items')),
});
