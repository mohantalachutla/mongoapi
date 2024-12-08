import joi from 'joi';
import { ValidationError } from '../error/common.error';

export const loginValidator = joi.object({
  // Should not display exact error
  email: joi
    .string()
    .required()
    .email({ minDomainSegments: 2 })
    .error(new ValidationError('Invalid username or password')),
  password: joi
    .string()
    .required()
    .error(new ValidationError('Invalid username or password')),
});
