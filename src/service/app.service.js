import { App } from '../model/app.model';
import _ from 'lodash';

/**
 *
 * @param {name: Name}
 * @param {url: URL}
 * @param {status: Status}
 * @returns app
 */
export const findApp = async ({ name, url, status }, projection = {}) => {
  let app = {};
  let where = {};
  // Mongoose.set("debug", true)
  where = _.chain({
    name,
    url,
    status,
  })
    .omitBy(_.isUndefined)
    .value();
  if (!_.isEmpty(where)) {
    app = await App.findOne(where, projection).lean().exec();
  }
  return app;
};

/**
 * Finds all apps
 * @returns apps
 */
export const findApps = async ({ status }, projection = {}) => {
  let apps = [];
  let where = {};
  // Mongoose.set("debug", true)
  where = _.chain({ status }).omitBy(_.isUndefined).value();
  apps = await App.find(where, projection).lean().exec();
  return apps;
};

/**
 * @requires name, url
 * @param name, url, modules, events
 * @returns app
 * @description creates an new app
 */
export const createApp = async ({
  name,
  url,
  modules,
  events,
  env,
  version,
  description,
  dependencies,
  devDependencies,
  peerDependencies,
  optionalDependencies,
  homepage,
  author,
  license,
  repository,
  engines,
  browserslist,
  keywords,
}) => {
  const account = new App(
    _.chain({
      name,
      url,
      modules,
      events,
      status: 'active',
      env: env,
      version: version,
      description: description,
      dependencies: dependencies,
      devDependencies: devDependencies,
      peerDependencies: peerDependencies,
      optionalDependencies: optionalDependencies,
      homepage: homepage,
      author: author,
      license: license,
      repository: repository,
      engines: engines,
      browserslist: browserslist,
      keywords: keywords,
    })
      .omitBy(_.isUndefined)
      .value()
  );
  return await account.save();
};

/**
 * @requires name, url
 * @param name, url, modules, events
 * @returns app
 * @description creates an new app
 */
export const updateApp = async ({
  name,
  url,
  modules,
  events,
  env,
  version,
  description,
  dependencies,
  devDependencies,
  peerDependencies,
  optionalDependencies,
  homepage,
  author,
  license,
  repository,
  engines,
  browserslist,
  keywords,
}) => {
  const input = _.chain({
    name,
    url,
    modules,
    events,
    env: env,
    version: version,
    description: description,
    dependencies: dependencies,
    devDependencies: devDependencies,
    peerDependencies: peerDependencies,
    optionalDependencies: optionalDependencies,
    homepage: homepage,
    author: author,
    license: license,
    repository: repository,
    engines: engines,
    browserslist: browserslist,
    keywords: keywords,
  })
    .omitBy(_.isUndefined)
    .value();
  return await App.updateOne({ name: input.name }, { $set: input })
    .lean()
    .exec();
};

/**
 * @requires name, status
 * @param name, status
 * @returns app
 * @description creates an new app
 */
export const updateStatus = async ({ name, status }) => {
  const input = _.chain({
    name,
    status: status || 'inactive',
  })
    .omitBy(_.isUndefined)
    .value();
  return await App.updateOne(
    { name: input.name },
    { $set: { status: input.status } }
  )
    .lean()
    .exec();
};

/**
 * Deletes an app
 * @param {string} name app name
 * @returns {Promise<MongoDB.Document | null>}
 * @description Deletes an app
 */
export const deleteApp = async ({ name }) => {
  return await App.deleteOne({ name }).lean().exec();
};

/**
 *
 * @param _id app id
 * @param projection
 * @returns  app
 */
export const findAppById = async (_id, projection = {}) => {
  let app = {};
  if (_id) {
    app = await App.findById(_id, projection).lean().exec();
  }
  return app;
};
