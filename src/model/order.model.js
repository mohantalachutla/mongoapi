import { model } from 'mongoose';
import orderSchema from './order.schema';

const Order = model('order', orderSchema);

export default Order;
