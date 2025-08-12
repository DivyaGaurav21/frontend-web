"use client";
import React, { useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const NavSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-bold hidden sm:block">Cart</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavSection;