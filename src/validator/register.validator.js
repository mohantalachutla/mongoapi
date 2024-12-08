import joi from 'joi';
import { ValidationError } from '../error/common.error';

export const registerValidator = joi.object({
  email: joi
    .string()
    .required()
    .email({ minDomainSegments: 2 })
    .error(new ValidationError('Invalid email')),
  password: joi
    .string()
    .required()
    .error(new ValidationError('Invalid password')),
});
