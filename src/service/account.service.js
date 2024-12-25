import _ from 'lodash';
import { RequiredError } from '../error/common.error';
import { AccountNotFoundError } from '../error/account.error';
import Account from '../model/account.model';
import { isEmpty } from '../util/lang.utils';
import { getSystemEmail } from '../util/account.util';

// Keep password separate
/**
 *
 * @param {username: Username}
 * @param {_id: Account ID}
 * @returns accountDocument
 */
export const findAccountDetails = async ({
  username,
  firstName,
  lastName,
  displayName,
  displayPicture,
  ssn,
  createdAt,
  updatedAt,
}) => {
  let account = await findAccount({
      username,
      firstName,
      lastName,
      displayName,
      displayPicture,
      ssn,
      createdAt,
      updatedAt,
    }),
    // Fetching balance
    wallet = await getBalance(account);
  account = { wallet, ...account };
  return account;
};

/**
 *
 * @param {_id: Account ID}
 * @returns accountDocument
 */
export const findAccountDetailsById = async (_id, projection) => {
  let account = await findAccountById(_id, projection),
    // Fetching balance
    wallet = await getBalance(account);
  account = { wallet, ...account };
  return account;
};

/**
 *
 * @param {username: Username}
 * @param {_id: Account ID}
 * @returns accountDocument
 */
export const findAccount = async ({ email, username }, projection = {}) => {
  let account = {};
  let where = {};
  // Mongoose.set("debug", true)
  where = _.chain({
    email,
    username,
  })
    .omitBy(_.isUndefined)
    .value();
  if (!isEmpty(where)) {
    account = await Account.findOne(where, projection).lean().exec();
  }
  if (isEmpty(account)) {
    throw new AccountNotFoundError();
  }
  return account;
};

/**
 *
 * @param {username: Username}
 * @param {_id: Account ID}
 * @returns accountDocument
 */
export const findAccounts = async ({ email, username }, projection = {}) => {
  let accounts = [];
  let where = {};
  // Mongoose.set("debug", true)
  where = _.chain({
    email,
    username,
  })
    .omitBy(_.isUndefined)
    .value();
  if (!isEmpty(where)) {
    where = { $or: [{ email }, { username }] };
    accounts = await Account.find(where, projection).lean().exec();
  }
  return accounts;
};

/**
 *
 * @param email
 * @param username
 * @param status
 * @param firstName
 * @param lastName
 * @param displayName
 * @param ssn
 * @param createdAt
 * @param updatedAt
 * @returns All the account related details
 * @description populates activities
 */
export const findAccountAndPopulate = async (
  {
    email,
    username,
    status = 'active',
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  },
  projection = {}
) => {
  let account = {},
    where = {};
  // Mongoose.set("debug", true)
  where = _.chain({
    email,
    username,
    status,
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  })
    .omitBy(_.isUndefined)
    .value();
  if (!isEmpty(where)) {
    account = await Account.findOne(where, projection)
      .populate('activities')
      .lean()
      .exec();
  }
  if (isEmpty(account)) {
    throw new AccountNotFoundError();
  }
  return account;
};

/**
 * @description fetches system account
 * @returns system account
 */
export const getSystemAccount = async () => {
  const email = getSystemEmail();
  console.log('System email:', email);
  return await findAccount({ email });
};

/**
 *
 * @param account
 * @returns balance =  totalCredit - totalDebit
 * @description calcutates balance by adding and subtracting debits and credits
 */

export const getBalance = async (account) => {
  if (!account && !_.isEmpty(account)) {
    throw new RequiredError(['account']);
  }
  let balance = 0;
  try {
    // Balance =
    //   (
    //     Await TransactionDetail.findOne({
    //       $or: [
    //         { _debitAccount: account._id, indicator: "dr" },
    //         { _creditAccount: account._id, indicator: "cr" },
    //       ],
    //     })
    //       .sort({ createdAt: -1 })
    //       .select({ _id: 0, balance: 1 })
    //   )?.balance ?? 0;
    balance = 0;
  } catch {
    balance = 0;
  }
  return balance;
};

/**
 * @requires email, password, username
 * @param email, password, username, firstName, lastName, displayName, displayPicture, ssn, createdAt, updatedAt
 * @returns account
 * @description creates an new account
 */
export const createAccount = async ({
  email,
  password,
  username,
  firstName,
  lastName,
  displayName,
  displayPicture,
  ssn,
  createdAt,
  updatedAt,
}) => {
  const account = new Account(
    _.chain({
      email,
      password,
      username,
      firstName,
      lastName,
      displayName,
      displayPicture,
      ssn,
      createdAt,
      updatedAt,
    })
      .omitBy(_.isUndefined)
      .value()
  );
  return await account.save();
};

/**
 *
 * @param _id account id
 * @param projection
 * @returns  account
 */
export const findAccountById = async (_id, projection = {}) => {
  let account = {};
  if (_id) {
    account = await Account.findById(_id, projection).lean().exec();
  }
  return account;
};
