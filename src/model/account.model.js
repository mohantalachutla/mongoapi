import { model } from 'mongoose';
import { accountSchema } from './account.schema';

const Account = model('account', accountSchema);

export default Account;
