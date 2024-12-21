import express from 'express';
import _ from 'lodash';
import {
  createApp,
  findApp,
  findApps,
  updateApp,
  updateStatus,
} from '../service/app.service';
import { appValidator } from '../validator/app.validator';
import { ApiResponse } from '../model/common/ApiResponse';

const appRouter = express.Router();

/**
 * @description Registers an App
 * @param status Status
 * @returns ApiResponse
 */
appRouter.post('/browse', async (req, res, next) => {
  const { fields } = req;

  try {
    const { status } = fields;
    try {
      let apps = await findApps({
        status,
      });
      return next(new ApiResponse(apps, 200, ''));
    } catch {
      null;
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description registers an App
 * @requires name, url
 * @param name Name
 * @param url Url
 * @param events Events
 * @param modules Modules
 * @returns ApiResponse
 */
appRouter.post('/register', async (req, res, next) => {
  const { fields } = req;

  try {
    const input = await appValidator.validateAsync({
      name: fields.name,
      url: fields.url,
      events: fields.events,
      modules: fields.modules,
      env: fields.env,
      version: fields.version,
      description: fields.description,
      dependencies: fields.dependencies,
      devDependencies: fields.devDependencies,
      peerDependencies: fields.peerDependencies,
      optionalDependencies: fields.optionalDependencies,
      homepage: fields.homepage,
      author: fields.author,
      license: fields.license,
      repository: fields.repository,
      engines: fields.engines,
      browserslist: fields.browserslist,
      keywords: fields.keywords,
    });

    try {
      let app = await findApp({
        name: input.name,
      });
      if (_.isEmpty(app)) {
        app = await createApp(_.chain(input).omitBy(_.isUndefined).value());
        return next(new ApiResponse(app, 200, ''));
      }
      app = await updateStatus({
        name: input.name,
        status: input.status || 'active',
      });
      return next(new ApiResponse(app, 200, ''));
    } catch {
      null;
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description unregisters an App
 * @requires name, url
 * @param name Name
 * @returns ApiResponse
 */
appRouter.post('/unregister', async (req, res, next) => {
  const { fields } = req;
  let app = {};
  try {
    try {
      app = await updateStatus(fields);
      return next(new ApiResponse(app, 200, ''));
    } catch {
      null;
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @description registers an App
 * @requires name, url
 * @param name Name
 * @param url Url
 * @param events Events
 * @param modules Modules
 * @returns ApiResponse
 */
appRouter.post('/update', async (req, res, next) => {
  const { fields } = req;

  try {
    const input = await appValidator.validateAsync({
      name: fields.name,
      url: fields.url,
      events: fields.events,
      modules: fields.modules,
      env: fields.env,
      version: fields.version,
      description: fields.description,
      dependencies: fields.dependencies,
      devDependencies: fields.devDependencies,
      peerDependencies: fields.peerDependencies,
      optionalDependencies: fields.optionalDependencies,
      homepage: fields.homepage,
      author: fields.author,
      license: fields.license,
      repository: fields.repository,
      engines: fields.engines,
      browserslist: fields.browserslist,
      keywords: fields.keywords,
    });

    try {
      let app = await findApp({
        name: input.name,
        status: input.status,
      });
      if (!_.isEmpty(app)) {
        app = await updateApp(_.chain(input).omitBy(_.isUndefined).value());
        return next(new ApiResponse(app, 200, ''));
      }
    } catch {
      null;
    }
  } catch (err) {
    next(err);
  }
});

export { appRouter };
