import _ from 'lodash';
import { BaseError } from '../error/base.error';
import { ApiResponse } from '../model/common/ApiResponse';
import { RequiredError } from '../error/common.error';

/**
 *
 * @param {*} out {}, [], "", ApiResponse, BaseError, Error
 * @param {*} req Express request
 * @param {*} res Express response
 * @param {*} next Express
 * @returns ApiResponse { payload, responseCode, responseMessage, responseCreatedAt}
 */

export const controllerTerminator = (out, req, res) => {
  //Logging result
  console.debug('<<<<<<<<<<controllerTerminator>>>>>>>>>>: out: \n');
  logResponse(out);

  //Success
  if (out instanceof ApiResponse) {
    res.status(200).send(out);
  }
  // Required error
  else if (out instanceof RequiredError) {
    // Check
    res.status(out.errorCode).send(
      new ApiResponse(
        {}, // Empty incase of error
        out.errorCode,
        out.errorMessage
      )
    );
  }
  // Expected error
  else if (out instanceof BaseError) {
    // Check
    res.status(out.errorCode).send(
      new ApiResponse(
        {}, // Empty incase of error
        out.errorCode,
        out.errorMessage
      )
    );
  }

  // Unexpected error
  else if (out instanceof Error) {
    res
      .status(out.errorCode ?? 500)
      .send(new ApiResponse({}, 500, 'Opps! Something went wrong'));
  }
  // {}, Object, [], Array, Map, Set
  else if (
    _.isObject(out) || //Not inherited
    _.isArray(out) ||
    _.isString(out) ||
    _.isMap(out) ||
    _.isSet(out)
  ) {
    res.status(200).send(
      new ApiResponse(
        out,
        200,
        '' // Empty response message
      )
    );
  }
  // Ending req with 400
  else {
    console.debug('Ending req with 400');
    res.status(400).send({});
  }
};

/**
 * @description To log response to console or file
 * print size of any array and first row for simplicity
 */
const logResponse = (out) => {
  if (out instanceof Error) {
    console.error(out.stack);
  } else if (out instanceof ApiResponse) console.debug(out.toString());
  else if (out instanceof Array) {
    out.forEach((item) =>
      console.debug(_.omitBy(item, (v, k) => _.isEqual(k, 'proofOfWork')))
    );
  } else console.debug(out);
};
