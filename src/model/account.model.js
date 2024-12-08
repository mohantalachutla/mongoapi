import { model } from 'mongoose';
import { accountSchema } from './account.schema';

export const Account = model('account', accountSchema);
