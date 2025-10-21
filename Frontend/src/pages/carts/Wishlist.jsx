import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';


import { toast } from 'react-toastify';
import { CartWishlistContext } from '../../context/CartWishlistContext';
import { AuthContext } from '../../context/AuthContext';

function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useContext(CartWishlistContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/products" className="flex items-center text-[#6C63FF] hover:text-[#4b2990]">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shopping
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4b2990]">
            Your Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
          </h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#f3e8ff] mb-6">
              <Heart className="h-10 w-10 text-[#6C63FF]" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              {user ? 'Start saving your favorite items!' : 'Sign in to save your favorite items'}
            </p>
            <Link
              to={user ? "/products" : "/login"}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#6C63FF] hover:bg-[#4b2990] focus:outline-none"
            >
              {user ? 'Browse Products' : 'Sign In'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(item => {
            const product = item.product; // backend sends product details inside "product"
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 group relative">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors z-10"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>

                {/* Product image */}
                <Link to={`/products/${product?.id}`} className="block relative">
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-60 object-cover group-hover:opacity-90 transition-opacity"
                  />
                </Link>

                <div className="p-4">
                  <Link to={`/products/${product?.id}`} className="block">
                    <h3 className="text-gray-800 font-medium mb-1">{product?.name}</h3>
                    <p className="text-[#6C63FF] font-bold">₹{product?.price}</p>
                  </Link>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-[#6C63FF] hover:bg-[#4b2990] text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </button>
                    <Link
                      to={`/products/${product?.id}`}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          </div>
        )}

        {/* Empty space at bottom */}
        <div className="mt-12"></div>
      </div>
    </div>
  );
}

export default Wishlist;