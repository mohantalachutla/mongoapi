import { BaseError } from './base.error';

class NotEnoughBalanceError extends BaseError {
  constructor() {
    super('NotEnoughBalanceError');
  }
}
class TransactionFailedError extends BaseError {
  constructor() {
    super('TransactionFailedError');
  }
}

export { NotEnoughBalanceError };
export { TransactionFailedError };
