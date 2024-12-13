import express from 'express';
import _ from 'lodash';

import { Account } from '../model/account.model';

import { signAuthToken } from '../util/auth.util';
import { extractLoginInfo } from '../middleware/auth.middleware';
import {
  createAccount,
  findAccount,
  findAccountDetails,
  findAccountDetailsById,
} from '../service/account.service';
import { createActivity } from '../service/activity.service';
import { constants } from '../constants/common.constants';
import { controllerTerminator } from '../middleware/controllerTerminator.middleware';
import {
  AccountCreationError,
  AccountDetailsNotFoundError,
  InvalidAccountTokenError,
} from '../error/account.error';
import { ApiResponse } from '../model/common/ApiResponse';
import { registerValidator } from '../validator/register.validator';
import { loginValidator } from '../validator/login.validator';

const authRouter = express.Router();

//Todo: encrypt password
/**
 * @requires email, password
 * @returns ApiResponse
 * @param email Email
 * @param username Username
 * @description Creates an Account
 */
authRouter.post(
  '/register',
  async (req, res, next) => {
    const { fields } = req;

    try {
      const input = await registerValidator.validateAsync({
        email: fields.email,
        password: fields.password,
      });

      // Make sure the email is unique
      try {
        await findAccount({ email: input.email });
        next(new ApiResponse({}, 400, 'Sorry email is allready used'));
      } catch (e) {
        console.error(e);
      }

      let account = new Account({
        ...input,
        username: input.email,
      });

      account = await createAccount(account);
      if (!account?._id) {
        throw new AccountCreationError();
      }

      // Activity
      const activity = await createActivity({
        accountId: account._id.toString(),
        activityName: constants.ACTIVITY_ACCOUNT_CREATED,
        modelName: 'Account',
        modelDocumentId: account._id,
        description: `Your account created ${account._id} at ${account.createdAt}`,
      });
      if (!activity?._id) {
        throw new AccountCreationError();
      }
      account = await findAccountDetailsById(account._id);
      // For instant login
      next(
        new ApiResponse(
          {
            ...account,
            token: signAuthToken(account._id), //GetAuthToken(account._id) // encrypted uid
          },
          200,
          'Registration Successful'
        )
      );
    } catch (err) {
      if (err instanceof AccountCreationError) {
        next(new ApiResponse({}, 400, 'Registration failed'));
      }
      next(err);
    }
  },
  controllerTerminator
);

/**
 * @param email Email
 * @requires email, password
 * @returns ApiResponse
 * @description Logsin an User
 */

authRouter.post(
  '/login',
  async (req, res, next) => {
    const { fields } = req;
    let account = {};

    try {
      // The three next line are for email validation (remove them if you wanna login with SYSTEM)
      const input = await loginValidator.validateAsync({
        email: fields.email,
        password: fields.password,
      });
      account =
        (await findAccount(
          { email: fields.email },
          { email: true, password: true } //"email + password"
        )) ?? // Force included password, exclueded at schema level
        {};
      if (!account?._id) {
        next(new ApiResponse({}, 400, 'Incorret UserName or Password'));
      }
      // The next line is for email validation (remove it if you wanna login with SYSTEM)
      if (account.password !== input.password) {
        next(new ApiResponse({}, 400, 'Incorret UserName or Password'));
      }

      account = await findAccountDetailsById(account._id);
      next(
        new ApiResponse(
          {
            ...account,
            token: signAuthToken(account._id), //GetAuthToken(account._id) // encrypted uid
          },
          200,
          'Login Successful'
        )
      );
    } catch (err) {
      next(err);
    }
  },
  controllerTerminator
);
authRouter.post(
  '/account',
  extractLoginInfo,
  async (req, res, next) => {
    const { CURRENTUSERID } = req;
    try {
      if (!CURRENTUSERID) {
        throw new InvalidAccountTokenError();
      }
      let account = await findAccountDetailsById(CURRENTUSERID);
      if (!account._id) {
        throw new AccountDetailsNotFoundError();
      }
      account = _.chain(account).omit('password').value();
      next({
        ...account,
        token: signAuthToken(account._id), //GetAuthToken(account._id) // encrypted uid
      });
    } catch (err) {
      if (err instanceof InvalidAccountTokenError) {
        next({});
        return;
      }
      next(err);
    }
  },
  controllerTerminator
);

authRouter.get(
  '/account/wallet',
  extractLoginInfo,
  async (req, res, next) => {
    const { CURRENT_USERID, CURRENT_USERNAME } = req;
    try {
      let account = await findAccountDetails({
        username: CURRENT_USERNAME,
        _id: CURRENT_USERID,
      });
      if (!account?.username) {
        throw new AccountDetailsNotFoundError();
      }
      account = _.chain(account).pick(['wallet', 'username']).value();
      next(account);
    } catch (err) {
      next(err);
    }
  },
  controllerTerminator
);
export { authRouter };
