import { RequiredError } from '../error/common.error';
import Activity from '../model/activity.model';

/**
 *
 * @param {*} accountId
 * @param {*} activityName
 * @param {*} modelName
 * @param {*} modelDocumentId
 * @param {*} description
 * @returns account
 * @throws throwable Error to be thrown
 */
export const createActivity = async (
  { accountId, activityName, modelName, modelDocumentId, description },
  throwable
) => {
  // Validate with joi
  if (
    !(accountId && activityName && modelName && modelDocumentId && description)
  ) {
    if (throwable && throwable instanceof Error) {
      throw (
        throwable ??
        new RequiredError([
          'accountId',
          'activityName',
          'modelName',
          'modelDocumentId',
          'description',
        ])
      );
    }
  }
  let activity = new Activity({
    _account: accountId,
    activity: activityName,
    modelForRef: modelName,
    _ref: modelDocumentId,
    description,
  });
  console.info(
    `activity -- ${modelName} ${activityName} : ${accountId} : ${description} `
  );
  activity = await activity.save();
  if (!activity._id && throwable) {
    throw throwable;
  }
  return activity;
};
