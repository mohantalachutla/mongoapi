import express from 'express';

import { authRouter } from './controller/auth.controller';
import { activityRouter } from './controller/activity.controller';
import { testRouter } from './controller/test.controller';

const apiRouter = express.Router();
apiRouter.use('/test', testRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/activity', activityRouter);

export default apiRouter;
