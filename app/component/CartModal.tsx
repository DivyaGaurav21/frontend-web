"use client";
import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cart-store';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  discount: number;
  brand: string;
  images: string[];
  stock: number;
  quantity: number;
}

interface CartSummary {
  totalItems: number;
  totalPrice: number;
  originalPrice: number;
  totalDiscount: number;
  savings: number;
}

const CartModal: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary
  } = useCartStore();

  const summary: CartSummary = getCartSummary();

  if (!isOpen) return null;

  const handleQuantityChange = (itemId: string, newQuantity: string): void => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(itemId, quantity);
    } else {
      removeFromCart(itemId);
    }
  };

  const getDiscountedPrice = (price: number, discount: number): number => {
    return Math.round(price * (1 - discount / 100));
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={closeCart}
      />
      
      {/* Modal - Responsive positioning */}
      <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header with gradient */}
          <div className="relative bg-primary text-white p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Shopping Cart</h2>
                  <p className="text-white/80 text-sm">
                    {summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Decorative elements */}
            <div onClick={closeCart}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500">Add some amazing products to get started</p>
                </div>
              ) : (
                items.map((item: CartItem) => {
                  const discountedPrice = getDiscountedPrice(item.price, item.discount);
                  const itemTotal = discountedPrice * item.quantity;
                  const originalItemTotal = item.price * item.quantity;
                  
                  return (
                    <div key={item._id} className="group rounded-xl p-4  border border-cyan-200">
                      {/* Product Info */}
                      <div className="flex space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg bg-gray-200 ring-2 ring-white shadow-sm"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/80x80/e5e5e5/999999?text=No+Image';
                            }}
                          />
                          {item.discount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{item.discount}%
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight mb-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            by {item.brand}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-gray-900">
                              {formatPrice(discountedPrice)}
                            </span>
                            {item.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Controls & Total */}
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200/50">
                        <div className="flex items-center space-x-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => decrementQuantity(item._id)}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            
                            <input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={item.quantity}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                handleQuantityChange(item._id, e.target.value)
                              }
                              className="w-14 px-3 py-2 text-center text-sm font-medium border-0 focus:ring-0 focus:outline-none"
                            />
                            
                            <button
                              onClick={() => incrementQuantity(item._id)}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                            {item.stock} in stock
                          </span>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">
                            {formatPrice(itemTotal)}
                          </div>
                          {item.discount > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(originalItemTotal)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer - Cart Summary & Actions */}
            {items.length > 0 && (
              <div className="border-t bg-gradient-to-r from-gray-50 to-white p-3 space-y-2">

                {/* Price Summary */}
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(summary.originalPrice)}
                    </span>
                  </div>
                  
                  {summary.totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">
                        Total Savings ({summary.savings}% off)
                      </span>
                      <span className="text-green-600 font-semibold">
                        -{formatPrice(summary.totalDiscount)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-xl font-bold pt-3 border-t border-dashed">
                    <span className="text-cyan-900">Total</span>
                    <span className="text-cyan-600">{formatPrice(summary.totalPrice)}</span>
                  </div>
                  
                  {summary.totalDiscount > 0 && (
                    <div className="text-center bg-green-50 text-green-700 py-2 px-4 rounded-lg animate-pulse">
                      <p className="text-sm font-bold animate-wiggle">
                        🎉 You save {formatPrice(summary.totalDiscount)} 🎉
                      </p>
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default CartModal;