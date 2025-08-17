"use client";
import React, { useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import useCartStore from '../store/cart-store';
import CartModal from './CartModal';

const NavSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { getTotalCartItemsNumber, openCart } = useCartStore();
  const totalCartItem = getTotalCartItemsNumber();

   const handleCartClick = (): void => {
    openCart();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
       <CartModal/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between h-20">

          <Link
            href="/"
            className="primary text-xl md:text-2xl lg:text-3xl font-bold italic underline">
            Gaurav Shop
          </Link>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search electronics products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right side - Menu, Sign Up/Sign In, Cart */}
          <div className="flex items-center space-x-4">
            {/* Sign Up/Sign In */}
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium hidden sm:block">Sign Up/Sign In</span>
            </div>

            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="flex items-center space-x-1 bg-primary text-white px-4 py-2 rounded-lg">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-bold hidden sm:block">Cart</span>
              <span className="bg-white primary rounded-full px-2 py-1 text-xs font-semibold m">
                {totalCartItem}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavSection;