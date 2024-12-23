import { App } from '../model/app.model';
import _ from 'lodash';
import { isEmpty } from '../util/lang.utils';
('lodash');

/**
 *
 * @param {name: Name}
 * @param {url: URL}
 * @param {status: Status}
 * @returns app
 */
export const findApp = async ({ name, url, env, status }, projection = {}) => {
  let app = {};
  let where = {};
  // Mongoose.set("debug", true)
  where = _.chain({
    name,
    url,
    env,
    status,
  })
    .omitBy(_.isUndefined)
    .value();
  if (!isEmpty(where)) {
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
  where = _.chain({
    status,
  })
    .omitBy(isEmpty)
    .value();
  // Mongoose.set("debug", true)
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
  const app = new App(
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
  return await app.save();
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
export const updateStatus = async ({
  name,
  version,
  url,
  env,
  status = 'inactive',
}) => {
  const input = _.chain({
    name,
    version,
    env,
    url,
  })
    .omitBy(isEmpty)
    .value();
  return await App.updateOne(input, { $set: { status } }).lean().exec();
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
