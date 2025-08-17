import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '../store/cart-store';

interface Product {
  _id: string;
  name: string;
  description: string;
  specifications: string;
  price: number;
  discount: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface ItemProps {
  product: Product;
  onAddToCart: (e: React.MouseEvent, product: Product) => void;
}

const Item: React.FC<ItemProps> = ({ product, onAddToCart }) => {
  const {isInCart} = useCartStore();
  const itemPresentInCart = isInCart(product._id);
  const calculateOriginalPrice = (price: number, discount: number) => {
    return Math.round(price / (1 - discount / 100));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryDisplay = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const originalPrice = calculateOriginalPrice(product.price, product.discount);
  const discountedPrice = product.price;

  return (
    <Link href={`/product/${product._id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:border border-cyan-300">
      {/* Product Image */}
      <div className="relative overflow-hidden min-h-72 bg-gray-50">
        <Image
          src={product.images[1]}
          width={300}
          height={300}
          alt={product.name}
          className="w-full max-h-72 object-cover"
        />

        {/* Discount Badge - Top Right */}
        {product.discount > 0 && (
          <div className="absolute top-0 right-0 bg-cyan-800 text-white px-2 py-2 rounded-tr-lg text-xs font-bold">
            {product.discount}%<br />OFF
          </div>
        )}

        {/* Stock Badge */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 min-h-[140px] flex flex-col justify-between">
        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Price and Save - Same Line */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {product.discount > 0 && (
            <span className="text-xs text-green-700 font-semibold">
              Save - {formatPrice(originalPrice - discountedPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => onAddToCart(e , product)}
          disabled={product.stock === 0 || itemPresentInCart}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2  ${
            product.stock === 0 || itemPresentInCart
              ? 'bg-cyan-100 text-gray-700 cursor-not-allowed'
              : 'bg-[#008ECC] text-white hover:bg-[#007BB8] hover:shadow-md cursor-pointer'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {product.stock === 0 ? 'Out of Stock' : itemPresentInCart ? 'Go to Cart' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </Link>
  );
};

export default Item;