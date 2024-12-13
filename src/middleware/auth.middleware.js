import {
  AnonymousError,
  InvalidAccountTokenError,
  UnauthorizedAccountError,
} from '../error/account.error';
import { findAccountById } from '../service/account.service';
import { verifyAuthToken } from '../util/auth.util';

// Breaks the circuit if account not found
export const canActivate = async (req, res, next) => {
  const { headers } = req;
  try {
    const token = headers?.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedAccountError();
    }
    const accountId = verifyAuthToken(token);
    if (!accountId) {
      throw new UnauthorizedAccountError();
    }
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
    const accountId = verifyAuthToken(token);
    if (!accountId) {
      throw new InvalidAccountTokenError();
    }
    const account = await findAccountById(accountId);
    req.CURRENT_USERID = account._id;
    req.CURRENT_USERNAME = account.username;
    next();
  } catch (err) {
    if (err instanceof AnonymousError) {
      next();
    } else {
      next(err);
    }
  }
};
