import { model } from 'mongoose';
import { appSchema } from './app.schema';

const App = model('app', appSchema);

export default App;
