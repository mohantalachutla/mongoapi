import {
  AnonymousError,
  InvalidAccountTokenError,
  UnauthorizedAccountError,
} from '../error/account.error';
import { findAccountById } from '../service/account.service';
import { verifyAuthToken } from '../util/auth.util';
import { isEmpty } from '../util/lang.utils';

// Breaks the circuit if account not found
export const canActivate = async (req, res, next) => {
  const { headers } = req;
  try {
    const token = headers?.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedAccountError();
    }
    const decoded = verifyAuthToken(token);
    if (
      !decoded ||
      !decoded.data ||
      !decoded.data._id ||
      !decoded.iat ||
      !decoded.exp
    ) {
      throw new UnauthorizedAccountError();
    }
    if (decoded.data.exp < Date.now() / 1000) {
      throw new UnauthorizedAccountError();
    }
    const accountId = decoded.data._id;
    if (accountId) {
      const account = await findAccountById(accountId);
      if (isEmpty(account)) {
        throw new UnauthorizedAccountError();
      }
      req.user = account;
      next();
    }
  } catch (err) {
    next(err);
  }
};

// Won't break the circuit even if account not found
export const extractLoginInfo = async (req, res, next) => {
  const { headers } = req;
  try {
    const token = headers?.authorization?.split(' ')[1];
    if (!token) {
      throw new AnonymousError();
    }
    const account = verifyAuthToken(token);
    if (!account?._id) {
      throw new UnauthorizedAccountError();
    }
    const accountId = account._id;
    if (accountId) {
      const account = await findAccountById(accountId);
      if (!account || account == {}) {
        throw new UnauthorizedAccountError();
      }
      if (account && account != {}) {
        req.CURRENT_USERID = new String(account._id).valueOf();
        req.CURRENT_USERNAME = new String(account.username).valueOf();
        next();
      }
    }
  } catch (err) {
    if (
      err instanceof AnonymousError ||
      err instanceof UnauthorizedAccountError ||
      err instanceof InvalidAccountTokenError
    ) {
      next(); // bypass to next middleware
    } else {
      next(err);
    }
  }
};
