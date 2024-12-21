import express from 'express';

import { authRouter } from './controller/auth.controller';
import { activityRouter } from './controller/activity.controller';
import { testRouter } from './controller/test.controller';
import { appRouter } from './controller/app.controller';

const apiRouter = express.Router();
apiRouter.use('/test', testRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/activity', activityRouter);
apiRouter.use('/app', appRouter);

export default apiRouter;
