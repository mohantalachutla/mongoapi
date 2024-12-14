import _ from 'lodash';
import { BaseError, SystemError } from '../error/base.error';
import { ApiResponse } from '../model/common/ApiResponse';

/**
 *
 * @param {*} out {}, [], "", ApiResponse, BaseError, Error
 * @param {*} req Express request
 * @param {*} res Express response
 * @param {*} next Express
 * @returns ApiResponse { payload, responseCode, responseMessage, responseCreatedAt}
 */

// eslint-disable-next-line no-unused-vars
export const controllerTerminator = (out, req, res, next) => {
  //Logging result
  console.log('<<<<<<<<<<controllerTerminator>>>>>>>>>>: out: \n');
  logResponse(out);

  //Success
  if (out instanceof ApiResponse) {
    res.status(out.responseCode ?? 200).send(out);
  }

  //System error
  else if (out instanceof SystemError) {
    res.status(out.errorCode ?? 500).send(
      new ApiResponse(
        {}, // Empty incase of error
        out.errorCode ?? 500,
        out.errorMessage
      )
    );
  }

  // Expected error
  else if (out instanceof BaseError) {
    // Check
    res.status(out.errorCode ?? 400).send(
      new ApiResponse(
        {}, // Empty incase of error
        out.errorCode ?? 400,
        out.errorMessage
      )
    );
  }

  // Unexpected error
  else if (out instanceof Error) {
    res
      .status(out.errorCode ?? 500)
      .send(
        new ApiResponse({}, out.errorCode ?? 500, 'Opps! Something went wrong')
      );
  }
  // {}, Object, [], Array, Map, Set but not Error or ApiResponse
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
    res.status(400).send({});
  }
};

/**
 * @description To log response to console or file
 * print size of any array and first row for simplicity
 */
const logResponse = (out) => {
  if (out instanceof Error) {
    console.error(out);
  } else if (out instanceof ApiResponse) console.debug(out.toString());
  else console.debug(JSON.stringify(out));
};
