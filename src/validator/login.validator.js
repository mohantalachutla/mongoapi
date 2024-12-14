import joi from 'joi';
import { ValidationError } from '../error/common.error';

export const loginValidator = joi
  .object({
    // Should not display exact error
    email: joi
      .string()
      .email({ minDomainSegments: 2 })
      .empty('')
      .error(new ValidationError('Invalid Email')),
    username: joi
      .string()
      .max(20)
      .error(new ValidationError('Invalid username')),
    password: joi
      .string()
      .required()
      .error(new ValidationError('Invalid password')),
  })
  .or('email', 'username')
  .error(new ValidationError('Invalid email or username'));
