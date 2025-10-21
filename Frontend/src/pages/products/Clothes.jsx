import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Heart, Star, ChevronRight, ShoppingCart } from 'lucide-react';

import ImageModal from '../../components/user/ImageModal'; // update path as per depth

import { motion } from 'framer-motion';
import { CartWishlistContext } from '../../context/CartWishlistContext';
import axiosInstance from '../../api/axiosConfig';

function Clothes() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, addToWishlist, addToCart } = useContext(CartWishlistContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('boys');

  useEffect(() => {
    axiosInstance.get('/products/')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const boys = products.filter(p => p.category === 'boys');
  const girls = products.filter(p => p.category === 'girls');
  const featured = products.filter(p => p.isFeatured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C63FF]"></div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      {/* Hero section with parallax effect */}
      <motion.section 
        className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 z-10"></div>
        <motion.img 
          src="/baby/fashion-hero.jpg" 
          alt="Baby fashion collection"
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6">
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg"
          >
            Adorable Baby Fashion
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl drop-shadow-lg"
          >
            Premium quality clothing for your little ones
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link 
              to="/products" 
              className="inline-flex items-center bg-white text-[#6C63FF] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <span>Explore Collection</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="ml-2"
              >
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <section className="py-16 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#4b2990] mb-4">Featured Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Handpicked selection of our most loved baby outfits</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featured.slice(0, 3).map(product => (
            <motion.div 
              key={product.id} 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 group relative"
              whileHover={{ y: -10 }}
            >
              <div className="relative">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:opacity-90 transition-opacity cursor-zoom-in"
                  onClick={() => setSelectedImage(product.image)}
                />
                <button 
                  onClick={() => addToWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full backdrop-blur-sm hover:bg-white transition-colors shadow-md"
                  aria-label="Add to wishlist"
                >
                  <Heart 
                    size={20}
                    className={`${wishlist.find(item => item.product?.id === product.id) ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}`}
                  />
                </button>
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-[#6C63FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                    New Arrival
                  </span>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                    <span className="text-xs ml-1 text-gray-700">{product.rating || '4.8'}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[#6C63FF] font-bold text-lg">₹{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-gray-400 text-sm line-through">₹{product.originalPrice}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-[#6C63FF] hover:text-white transition-colors"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
                
                <Link 
                  to={`/products/${product.id}`}
                  className="block w-full text-center py-3 px-4 bg-gradient-to-r from-[#6C63FF] to-[#4b2990] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#4b2990] mb-6 text-center"
            >
              Shop By Category
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex space-x-2 bg-gray-100 p-1 rounded-full"
            >
              <button
                onClick={() => setActiveTab('boys')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'boys' ? 'bg-[#6C63FF] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Boys
              </button>
              <button
                onClick={() => setActiveTab('girls')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'girls' ? 'bg-[#6C63FF] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Girls
              </button>
            </motion.div>
          </div>

          {activeTab === 'boys' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {boys.map(product => (
                <motion.div 
                  key={product.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-60 object-cover group-hover:opacity-90 transition-opacity cursor-zoom-in"
                      onClick={() => setSelectedImage(product.image)}
                    />
                    <button 
                      onClick={() => addToWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
                      aria-label="Add to wishlist"
                    >
                      <Heart 
                        size={20}
                        className={`${wishlist.find(item => item.id === product.id) ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}`}
                      />
                    </button>
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-800 font-medium">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                        <span className="text-xs ml-1">{product.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[#6C63FF] font-bold">₹{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-gray-400 text-sm line-through">₹{product.originalPrice}</p>
                      )}
                    </div>
                    
                    <Link 
                      to={`/products/${product.id}`}
                      className="block w-full text-center py-2 px-4 bg-[#6C63FF] hover:bg-[#4b2990] text-white rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'girls' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {girls.map(product => (
                <motion.div 
                  key={product.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-60 object-cover group-hover:opacity-90 transition-opacity cursor-zoom-in"
                      onClick={() => setSelectedImage(product.image)}
                    />
                    <button 
                      onClick={() => addToWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
                      aria-label="Add to wishlist"
                    >
                      <Heart 
                        size={20}
                        className={`${wishlist.find(item => item.id === product.id) ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}`}
                      />
                    </button>
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-800 font-medium">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                        <span className="text-xs ml-1">{product.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[#6C63FF] font-bold">₹{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-gray-400 text-sm line-through">₹{product.originalPrice}</p>
                      )}
                    </div>
                    
                    <Link 
                      to={`/products/${product.id}`}
                      className="block w-full text-center py-2 px-4 bg-[#6C63FF] hover:bg-[#4b2990] text-white rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#6C63FF] to-[#4b2990] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Join Our Baby Club
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Get 10% off your first order and exclusive access to new collections
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to="/registration" 
              className="inline-block bg-white text-[#6C63FF] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Sign Up Now
            </Link>
          </motion.div>
        </div>
      </section>

      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}

export default Clothes;