import { SystemError, UserAwarenessError, BaseError } from './base.error';

class ValidationError extends UserAwarenessError {
  constructor(errorMessage) {
    super('ValidationError', 400, errorMessage);
  }
}

class RequiredError extends UserAwarenessError {
  constructor(fields, got = undefined) {
    super(`RequiredError`, 400), `fields ${fields} but got ${got}`;
    this.fields = fields;
    this.got;
  }
}
class EnvNotSetError extends SystemError {
  constructor(message) {
    super(`${message} EnvNotSetError`);
  }
}

class DBError extends BaseError {
  constructor(errorMessage = 'Something went wrong') {
    super('DBError', 500, errorMessage);
  }
}

export { EnvNotSetError, RequiredError, ValidationError, DBError };
