export interface ProductImage {
  id: string;
  file: File;
  preview: string;
}

export interface ProductData {
  name: string;
  description: string;
  specifications: string;
  price: string;
  discount: string;
  category: string;
  brand: string;
  stock: string;
}

export interface Product extends Omit<ProductData, 'price' | 'stock' | 'discount'> {
  _id: string;
  price: number;
  discount: number;
  stock: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}