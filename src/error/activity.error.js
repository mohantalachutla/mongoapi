import { BaseError } from './base.error';

class ActivityCreationError extends BaseError {
  constructor() {
    super('AccountCreationError', 400, 'Unable to register youuu!');
  }
}

export { ActivityCreationError };
