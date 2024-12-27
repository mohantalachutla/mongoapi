import joi from 'joi';
import { ValidationError } from '../error/common.error';
import { isMongoId } from '../util/common.util';
import { isEmpty } from '../util/lang.utils';

export const orderValidator = joi.object({
  accountId: joi
    .custom((value) => isMongoId(value) && value)
    .required()
    .error(new ValidationError('Invalid accountId')),
  items: joi
    .required()
    .custom(
      (value) =>
        Array.isArray(value) && !isEmpty(value) && value.map(isMongoId) && value
    )
    .error(new ValidationError('Invalid items')),
  status: joi.string().error(new ValidationError('Invalid status')),
  address: joi
    .string()
    .required()
    .error(new ValidationError('Invalid address')),
});
