import { model } from 'mongoose';
import { activitySchema } from './activity.schema';

const Activity = model('activity', activitySchema);

export default Activity;
