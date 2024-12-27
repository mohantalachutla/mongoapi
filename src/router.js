import express from 'express';

import { canActivate } from './middleware/auth.middleware';
import { authRouter } from './controller/auth.controller';
import { activityRouter } from './controller/activity.controller';
import { testRouter } from './controller/test.controller';
import { appRouter } from './controller/app.controller';
import { productRouter } from './controller/product.controller';
import { wishlistRouter } from './controller/wishlist.controller';

const apiRouter = express.Router();
apiRouter.use('/test', testRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/activity', activityRouter);
apiRouter.use('/app', canActivate, appRouter);
apiRouter.use('/product', canActivate, productRouter);
apiRouter.use('/wishlist', canActivate, wishlistRouter);

export default apiRouter;
