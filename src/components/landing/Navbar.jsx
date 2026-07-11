import React from 'react';
import { Search, ShoppingCart, Menu, PhoneCall } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-black tracking-wider text-blue-600">KENT</span>
            <span className="text-xs ml-1 text-gray-500 font-semibold self-end mb-2">CLONE</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 font-medium text-gray-700">
            <a href="#" className="hover:text-blue-600 transition">Water Purifiers</a>
            <a href="#" className="hover:text-blue-600 transition">Kitchen Appliances</a>
            <a href="#" className="hover:text-blue-600 transition">Air Purifiers</a>
            <a href="#" className="hover:text-blue-600 transition">Disinfectants</a>
          </div>

          {/* Right Utilities Bar */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="relative hidden lg:block">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-48 bg-gray-50 text-sm border border-gray-200 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all focus:w-64"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Cart Icon */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                0
              </span>
            </button>

            {/* CTA Button */}
            <button className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-blue-700 shadow-md shadow-blue-100 transition">
              <PhoneCall className="h-4 w-4" />
              Book Free Demo
            </button>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-gray-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}