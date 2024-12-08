//Others
import dotEnv from 'dotenv';
const dotEnvConfig = dotEnv.config();
import dotenv_expand from 'dotenv-expand';
dotenv_expand(dotEnvConfig);
import express from 'express';
import cors from 'cors';
// Const bodyParser = require('body-parser')
import * as eFormidable from 'express-formidable';
import eSession from 'express-session';
import packageJson from '../package.json';
import { isProd } from '../scripts/index.js';

// Core
import process from 'process';

//Local
import { authRouter } from './controller/auth.controller';
import { activityRouter } from './controller/activity.controller';
import { testRouter } from './controller/test.controller';

import { db } from './config/mongoose.config';
import { EnvNotSetError } from './error/common.error';
import { controllerTerminator } from './middleware/controllerTerminator.middleware';
import { getSystemAccount } from './service/account.service';
import { SystemError } from './error/base.error';
import { getImageLocation } from './util/image.util';

const app = express(),
  corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
  };

//Middilewares
if (!isProd()) {
  app.use(cors(corsOptions));
}
if (!isProd()) {
  import('morgan').then(({ default: morgan }) => {
    app.use(morgan('dev'));
  });
}
// App.use(bodyParser())
app.use(
  eFormidable({
    encoding: 'utf-8',
    multiples: true,
  })
);
app.use(
  eSession({ resave: false, saveUninitialized: true, secret: 'itsasecret' })
);

// Routes
app.get('/', (req, res) => {
  res.status(201).send(`An ${packageJson.name} express server`);
});

app.use((req, res, next) => {
  const { fields, files, query, session, headers } = req;
  console.debug('>>>>>>>>>>>>>> New request <<<<<<<<<<');
  console.debug({ fields, files, query, session, headers });
  next();
});

app.use('/test', testRouter);
app.use('/auth', authRouter);
app.use('/activity', activityRouter);

/**
 * Handles response and errors forwarded from controllers
 */
app.use(controllerTerminator);

//Environment variables
if (
  !(
    process.env.HOST &&
    process.env.PORT &&
    process.env.MONGO_DB_URL &&
    getImageLocation()
  )
) {
  throw new EnvNotSetError();
}

const { PORT, MONGO_DB_URL, HOST } = process.env;
let SYSTEM,
  notATopLevelAwait = async () => {
    const session = await db(MONGO_DB_URL);

    if (!session) {
      throw new SystemError(
        'DBSessionError',
        500,
        `Connection not established with ${MONGO_DB_URL}`
      );
    }

    SYSTEM = await getSystemAccount();
    if (!SYSTEM?._id) {
      throw new SystemError(
        'SystemAccountError',
        500,
        'System account required'
      );
    }

    // All set; start server
    app.listen(PORT, (err) => {
      if (err) {
        console.error(err);
        throw new SystemError(
          'ServerError',
          500,
          `Connection not established at  ${HOST}:${PORT}`
        );
      }
      console.info(`Server running at port : ${PORT}`);
    });
  };
notATopLevelAwait();
