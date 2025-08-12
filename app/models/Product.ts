import mongoose, { Document, Schema } from 'mongoose';
import { Product } from '@/app/types/product';

export interface ProductDocument extends Product, Document {}

const ProductSchema = new Schema<ProductDocument>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  specifications: {
    type: String,
    trim: true,
    maxlength: [1000, 'Specifications cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'heating-appliances', 
        'cooling-appliances', 
        'home-entertainment', 
        'refrigeration-appliances', 
        'laundry-appliances', 
        'kitchen-appliances'
      ],
      message: '{VALUE} is not a valid category'
    }
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be a whole number'
    }
  },
  images: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

// Create indexes
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);