import { model } from 'mongoose';
import cartSchema from './cart.schema';

const Cart = model('cart', cartSchema);

export default Cart;
