import { model } from 'mongoose';
import productSchema from './product.schema';

const Product = model('product', productSchema);

export default Product;
