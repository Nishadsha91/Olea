import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import { Heart, Star, ChevronRight, Gift, ShoppingCart } from 'lucide-react';

import ImageModal from '../../components/user/ImageModal';
import { motion } from 'framer-motion';
import { CartWishlistContext } from '../../context/CartWishlistContext';

function Toys() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, addToWishlist, addToCart } = useContext(CartWishlistContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

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

  const allToys = products.filter(p => p.category === 'toys');
  const featuredToys = allToys.filter(toy => toy.isFeatured);
  const educationalToys = allToys.filter(toy => toy.tags?.includes('educational'));
  const outdoorToys = allToys.filter(toy => toy.tags?.includes('outdoor'));

  const filteredToys = 
    activeFilter === 'featured' ? featuredToys :
    activeFilter === 'educational' ? educationalToys :
    activeFilter === 'outdoor' ? outdoorToys :
    allToys;

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
      {/* Hero section with playful elements */}
      <motion.section 
        className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#6C63FF]/40 to-[#4b2990]/20 z-10"></div>
        <motion.img 
          src="/toys/kids.jpg" 
          alt="Colorful toy collection"
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <Gift className="w-16 h-16 text-white mx-auto" />
          </motion.div>
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg"
          >
            Wonderland of Toys
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl drop-shadow-lg"
          >
            Spark imagination with our safe, fun and educational toys
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link 
              to="/products?category=toys" 
              className="inline-flex items-center bg-white text-[#6C63FF] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <span>Explore Toys</span>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="ml-2"
              >
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Filters */}
      <section className="py-12 container mx-auto px-4  text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className=""
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#4b2990] mb-6">
            Our Toy Collection
          </h2>
         
        </motion.div>

        {/* Toys Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filteredToys.map(product => (
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
                  className="w-full h-60 object-cover group-hover:opacity-90 transition-opacity cursor-zoom-in"
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
                    New
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="absolute bottom-4 left-4 bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                    Best Seller
                  </span>
                )}
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-gray-800 font-medium">{product.name}</h3>
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
                  className="block w-full text-center py-2 px-4 bg-gradient-to-r from-[#6C63FF] to-[#4b2990] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Safety & Education Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#E7F5FF] to-[#F3E8FF] rounded-2xl p-8 md:p-12 overflow-hidden relative"
          >
            <div className="absolute -right-10 -bottom-10 opacity-20">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 0C44.8 0 0 44.8 0 100C0 155.2 44.8 200 100 200C155.2 200 200 155.2 200 100C200 44.8 155.2 0 100 0ZM100 180C55.8 180 20 144.2 20 100C20 55.8 55.8 20 100 20C144.2 20 180 55.8 180 100C180 144.2 144.2 180 100 180Z" fill="#6C63FF"/>
                <path d="M100 40C67.2 40 40 67.2 40 100C40 132.8 67.2 160 100 160C132.8 160 160 132.8 160 100C160 67.2 132.8 40 100 40ZM100 140C78.4 140 60 121.6 60 100C60 78.4 78.4 60 100 60C121.6 60 140 78.4 140 100C140 121.6 121.6 140 100 140Z" fill="#4b2990"/>
                <path d="M100 80C89.6 80 80 89.6 80 100C80 110.4 89.6 120 100 120C110.4 120 120 110.4 120 100C120 89.6 110.4 80 100 80Z" fill="#6C63FF"/>
              </svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#4b2990] mb-6">
                Safe & Educational Play
              </h2>
              <p className="text-gray-700 mb-8 max-w-3xl">
                All our toys are carefully selected to meet the highest safety standards while promoting 
                creativity, learning, and development. We prioritize non-toxic materials and age-appropriate 
                designs to ensure your child's playtime is both fun and beneficial.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🧪', title: 'STEM Learning', desc: 'Promotes science & math skills' },
                  { icon: '🎨', title: 'Creative Play', desc: 'Encourages imagination & art' },
                  { icon: '🌳', title: 'Eco-Friendly', desc: 'Sustainable materials' },
                  { icon: '🛡️', title: 'Safety Certified', desc: 'Meets all safety standards' },
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-sm"
                  >
                    <span className="text-3xl block mb-3">{item.icon}</span>
                    <h3 className="font-bold text-lg text-[#4b2990] mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Age Guide Section */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#4b2990] mb-4">
              Age-Appropriate Toys
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect toys for your child's developmental stage
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { range: '0-12 months', color: 'from-[#A5D8FF] to-[#74C0FC]', desc: 'Sensory toys, soft books, and rattles' },
              { range: '1-3 years', color: 'from-[#B197FC] to-[#9775FA]', desc: 'Building blocks, push toys, and simple puzzles' },
              { range: '3-5 years', color: 'from-[#FFD8A8] to-[#FFC078]', desc: 'Pretend play, art supplies, and ride-ons' },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className={`bg-gradient-to-r ${item.color} p-6 rounded-2xl text-white shadow-lg`}
              >
                <h3 className="text-2xl font-bold mb-3">{item.range}</h3>
                <p className="mb-4">{item.desc}</p>
                <Link 
                  to={`/products?age=${item.range.split('-')[0]}`}
                  className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Shop Now
                </Link>
              </motion.div>
            ))}
          </div>
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

export default Toys;