import express from 'express';

import { ApiResponse } from '../model/common/ApiResponse';
const activityRouter = express.Router();

activityRouter.get('', async (req, res, next) => {
  const apiResponse = new ApiResponse('activity get');

  next(apiResponse);
});

export { activityRouter };
