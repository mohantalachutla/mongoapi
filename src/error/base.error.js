/**
 * @requires @param {*} name
 * @param {*} errorcode
 * @param {*} errorMessage
 * @description
 * System Defined error
 * Should be logged to system log
 */
class BaseError extends Error {
  constructor(name, errorCode, errorMessage) {
    super(name);
    this.errorCode = errorCode ?? 400;
    this.errorMessage = errorMessage ?? '';
  }
  setErrorCode(errorCode) {
    this.errorCode = errorCode ?? 400;
    return this;
  }
  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage ?? '';
    return this;
  }
}

/**
 * Error: UserAwarenessError
 * Can be displayed to user
 * http code : 400
 */
class UserAwarenessError extends BaseError {
  constructor(name, errorCode, errorMessage) {
    super(name, errorCode ?? 400, errorMessage);
  }
}

/**
 * Should not be displayed to user
 * http code : 500
 */
class SystemError extends BaseError {
  constructor(name, errorCode, errorMessage) {
    super(name, errorCode ?? 500, errorMessage);
  }
}

export { BaseError, UserAwarenessError, SystemError };
