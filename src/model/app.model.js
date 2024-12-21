import { model } from 'mongoose';
import { appSchema } from './app.schema';

export const App = model('app', appSchema);
