import { RequiredError } from '../error/common.error';
import { AccountNotFoundError } from '../error/account.error';
import { Account } from '../model/account.model';
import _ from 'lodash';

// Keep password separate
/**
 *
 * @param {cryptoAddress: Crypto Address}
 * @param {_id: Account ID}
 * @returns accountDocument
 */
export const findAccountDetails = async ({
  cryptoAddress,
  firstName,
  lastName,
  displayName,
  displayPicture,
  ssn,
  createdAt,
  updatedAt,
}) => {
  let account = await findAccount({
      cryptoAddress,
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
 * @param {cryptoAddress: Crypto Address}
 * @param {_id: Account ID}
 * @returns accountDocument
 */
export const findAccount = async (
  {
    email,
    cryptoAddress,
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
    cryptoAddress,
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
  if (!_.isEmpty(where)) {
    account = await Account.findOne(where, projection).lean().exec();
  }
  if (_.isEmpty(account)) {
    throw new AccountNotFoundError();
  }
  return account;
};

/**
 *
 * @param email
 * @param cryptoAddress
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
    cryptoAddress,
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
    cryptoAddress,
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
  if (!_.isEmpty(where)) {
    account = await Account.findOne(where, projection)
      .populate('activities')
      .lean()
      .exec();
  }
  if (_.isEmpty(account)) {
    throw new AccountNotFoundError();
  }
  return account;
};

/**
 * @description fetches system account
 * @returns SYSTEM
 */
export const getSystemAccount = async () => {
  const cryptoAddress = 'SYSTEM';
  return await findAccount({ cryptoAddress });
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
 * @requires email, password, cryptoaddress
 * @param email, password, cryptoAddress, firstName, lastName, displayName, displayPicture, ssn, createdAt, updatedAt
 * @returns account
 * @description creates an new account
 */
export const createAccount = async ({
  email,
  password,
  cryptoAddress,
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
      cryptoAddress,
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
