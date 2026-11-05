import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  item_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  price: {
    type: String,
    required: true,
  },
  price_num: {
    type: Number,
    required: true,
    index: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  stock: {
    type: Number,
    default: 100,
  },
  rating: {
    type: Number,
    default: 4.8,
  }
}, {
  timestamps: true
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;

