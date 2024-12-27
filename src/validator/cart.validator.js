import joi from 'joi';
import { ValidationError } from '../error/common.error';
import { isMongoId } from '../util/common.util';
import { isEmpty } from '../util/lang.utils';

export const cartValidator = joi.object({
  accountId: joi
    .custom((value) => isMongoId(value) && value)
    .required()
    .error(new ValidationError('Invalid accountId')),
  items: joi
    .custom(
      (value) =>
        isEmpty(value) ||
        (Array.isArray(value) && value.map(isMongoId) && value)
    )
    .error(new ValidationError('Invalid items')),
  archivedItems: joi
    .custom(
      (value) =>
        isEmpty(value) ||
        (Array.isArray(value) && value.map(isMongoId) && value)
    )
    .error(new ValidationError('Invalid archivedItems')),
});
