import express from 'express';

import { canActivate } from './middleware/auth.middleware';
import { authRouter } from './controller/auth.controller';
import { activityRouter } from './controller/activity.controller';
import { testRouter } from './controller/test.controller';
import { appRouter } from './controller/app.controller';
import { productRouter } from './controller/product.controller';
import { wishlistRouter } from './controller/wishlist.controller';
import { orderRouter } from './controller/order.controller';
import { cartRouter } from './controller/cart.controller';

const apiRouter = express.Router();
apiRouter.use('/test', testRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/activity', activityRouter);
apiRouter.use('/app', canActivate, appRouter);
apiRouter.use('/product', canActivate, productRouter);
apiRouter.use('/wishlist', canActivate, wishlistRouter);
apiRouter.use('/order', canActivate, orderRouter);
apiRouter.use('/cart', canActivate, cartRouter);

export default apiRouter;
