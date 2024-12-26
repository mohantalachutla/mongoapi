import joi from 'joi';
import { ValidationError } from '../error/common.error';

export const productValidator = joi.object({
  name: joi.string().required().error(new ValidationError('Invalid name')),
  description: joi.string().error(new ValidationError('Invalid description')),
  type: joi
    .string()
    .required()
    .error(new ValidationError('Invalid product type')),
  subtype: joi.string().error(new ValidationError('Invalid product subtype')),
  totalItems: joi.number().error(new ValidationError('Invalid totalItems')),
  availableItems: joi
    .number()
    .error(new ValidationError('Invalid availableItems')),
  rating: joi.number().error(new ValidationError('Invalid rating')),
  image: joi.object().error(new ValidationError('Invalid image')),
  price: joi.number().required().error(new ValidationError('Invalid price')),
});
