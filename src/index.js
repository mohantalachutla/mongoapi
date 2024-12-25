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
import { isProd } from '../scripts/index.cjs';

// api router
import apiRouter from './router';
// Core
import process from 'process';

import { db } from './config/mongoose.config';
import { EnvNotSetError } from './error/common.error';
import { controllerTerminator } from './middleware/controllerTerminator.middleware';
import { getSystemAccount } from './service/account.service';
import { SystemError } from './error/base.error';
import { getImageLocation } from './util/image.util';
import initiateMigration from './migration/migrate';

const app = express(),
  corsOptions = {
    origin: (process.env.CORS_ORIGIN ?? '').split(',') || '*',
    credentials: true,
    optionsSuccessStatus: 200,
  };

//Middilewares
app.use(isProd() ? cors(corsOptions) : cors());
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

app.use('/api', apiRouter);

/**
 * Handles response and errors forwarded from controllers
 */
app.use(controllerTerminator);

//Environment variables
if (!(process.env.PORT && process.env.MONGO_DB_URL && getImageLocation())) {
  throw new EnvNotSetError();
}

const { PORT, MONGO_DB_URL } = process.env;
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

    await initiateMigration();

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
          `Connection not established.`
        );
      }
      console.info(`Server running at port : ${PORT}`);
    });
  };
notATopLevelAwait();
