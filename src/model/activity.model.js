import { model } from 'mongoose';
import { activitySchema } from './activity.schema';

export const Activity = model('activity', activitySchema);
