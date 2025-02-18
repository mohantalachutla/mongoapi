import express from 'express';
import _ from 'lodash';

import Account from '../model/account.model';

import { signAuthToken } from '../util/auth.util';
import { extractLoginInfo } from '../middleware/auth.middleware';
import {
  createAccount,
  findAccount,
  findAccountDetails,
  findAccountDetailsById,
  findAccounts,
} from '../service/account.service';
import { createActivity } from '../service/activity.service';
import { constants } from '../constants/common.constants';
import {
  AccountCreationError,
  AccountDetailsNotFoundError,
  InvalidAccountTokenError,
} from '../error/account.error';
import { ApiResponse } from '../model/common/ApiResponse';
import { registerValidator } from '../validator/register.validator';
import { loginValidator } from '../validator/login.validator';
import { isEmpty } from '../util/lang.utils';

const authRouter = express.Router();

//Todo: encrypt password
/**
 * @requires email, password
 * @returns ApiResponse
 * @param email Email
 * @param username Username
 * @description Creates an Account
 */
authRouter.post('/register', async (req, res, next) => {
  const { fields } = req;

  try {
    const input = await registerValidator.validateAsync({
      email: fields.email,
      username: fields.username,
      password: fields.password,
    });

    // Make sure the email is unique
    try {
      let accounts = await findAccounts({
        email: input.email,
        username: input.username,
      });
      if (!isEmpty(accounts))
        return next(
          new ApiResponse({}, 400, 'Email or Username is already in use')
        );
    } catch {
      null;
    }

    let account = new Account(input);

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
          token: signAuthToken(account),
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
});

/**
 * @param email Email
 * @requires email, password
 * @returns ApiResponse
 * @description Logsin an User
 */

authRouter.post('/login', async (req, res, next) => {
  const { fields } = req;
  let account = {};
  const isEmail = (email = '') => {
    return email.includes('@');
  };
  try {
    // The three next line are for email validation (remove them if you wanna login with SYSTEM)
    const input = await loginValidator.validateAsync({
      email: isEmail(fields.email) ? fields.email : '',
      username: !isEmail(fields.email) ? fields.email : '',
      password: fields.password,
    });
    account =
      (await findAccount(
        input.email ? { email: input.email } : { username: input.username },
        { email: true, password: true } //"email + password"
      )) ?? // Force included password, exclueded at schema level
      {};
    if (!account?._id) {
      return next(new ApiResponse({}, 400, 'Account not found'));
    }
    // The next line is for email validation (remove it if you wanna login with SYSTEM)
    if (account.password !== input.password) {
      return next(new ApiResponse({}, 400, 'Incorret UserName or Password'));
    }

    account = await findAccountDetailsById(account._id);
    next(
      new ApiResponse(
        {
          ...account,
          token: signAuthToken(account), //GetAuthToken(account._id) // encrypted uid
        },
        200,
        'Login Successful'
      )
    );
  } catch (err) {
    return next(err);
  }
});
authRouter.get('/account', extractLoginInfo, async (req, res, next) => {
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
      token: signAuthToken(account), //GetAuthToken(account._id) // encrypted uid
    });
  } catch (err) {
    if (err instanceof InvalidAccountTokenError) {
      next({});
      return;
    }
    next(err);
  }
});

authRouter.get('/account/wallet', extractLoginInfo, async (req, res, next) => {
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
});
export { authRouter };
