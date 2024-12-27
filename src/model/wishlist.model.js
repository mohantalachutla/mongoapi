import { model } from 'mongoose';
import wishlistSchema from './wishlist.schema';

const Wishlist = model('wishlist', wishlistSchema);

export default Wishlist;
