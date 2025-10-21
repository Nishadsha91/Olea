import React, { useEffect, useState, useMemo, useContext } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, X, ArrowUp, ArrowDown, Star, Heart, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageModal from '../../components/user/ImageModal';
import { AuthContext } from '../../context/AuthContext';
import { CartWishlistContext } from '../../context/CartWishlistContext';
import { toast } from 'react-toastify';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [ageRange, setAgeRange] = useState('all'); // Age filter
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { wishlist, addToWishlist, addToCart } = useContext(CartWishlistContext);

  const ageOptions = [
    { id: 'all', label: 'All Ages' },
    { id: '0-6', label: '0-6 months' },
    { id: '6-12', label: '6-12 months' },
    { id: '1-2', label: '1-2 years' },
    { id: '2-3', label: '2-3 years' },
    { id: '3-5', label: '3-5 years' },
  ];

  const categories = useMemo(() => [
    { id: 'all', name: 'All Categories' },
    { id: 'boys', name: 'Boys Clothes' },
    { id: 'girls', name: 'Girls Clothes' },
    { id: 'toys', name: 'Toys' },
  ], []);

  // Fetch products
  useEffect(() => {
    axiosInstance.get('/products/')
      .then(res => {
        setProducts(res.data);
        setLoading(false);

        if (res.data.length > 0) {
          const prices = res.data.map(p => p.price);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
        toast.error('Failed to load products.');
      });
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p =>
        (category === 'all' || p.category === category) &&
        (ageRange === 'all' || (p.ageRange && p.ageRange === ageRange)) &&
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
      )
      .sort((a, b) => {
        if (sortOrder === 'asc') return a.price - b.price;
        if (sortOrder === 'desc') return b.price - a.price;
        return 0;
      });
  }, [products, search, category, sortOrder, priceRange, ageRange]);

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setSortOrder('');
    setAgeRange('all');
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.warning('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C63FF]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-[#4b2990] mb-4 bg-gradient-to-r from-[#6C63FF] to-[#4b2990] bg-clip-text text-transparent">
          Discover Our Collection
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Carefully curated selection for your little ones
        </p>
      </motion.div>

      {/* Filter Controls */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter - Desktop */}
          <div className="hidden md:block">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] appearance-none bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Age Filter - Desktop */}
          <div className="hidden md:block">
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <select
              className="block w-full pl-3 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] appearance-none bg-white"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
            >
              {ageOptions.map(age => (
                <option key={age.id} value={age.id}>{age.label}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <input
              type="range"
              min={Math.min(...products.map(p => p.price))}
              max={Math.max(...products.map(p => p.price))}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6C63FF]"
            />
          </div>

          {/* Sort Controls */}
          {/* <div className="flex space-x-3">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? '' : 'asc')}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${sortOrder === 'asc' ? 'bg-[#6C63FF] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              <span>Low-High</span>
            </button>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? '' : 'desc')}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${sortOrder === 'desc' ? 'bg-[#6C63FF] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              <span>High-Low</span>
            </button>
          </div> */}
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden mt-4 w-full flex items-center justify-center px-4 py-3 bg-[#6C63FF] text-white rounded-xl"
        >
          <Filter className="h-5 w-5 mr-2" />
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Mobile Filters Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Category Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`py-2 px-3 rounded-lg text-sm ${category === cat.id ? 'bg-[#6C63FF] text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ageOptions.map(age => (
                      <button
                        key={age.id}
                        onClick={() => setAgeRange(age.id)}
                        className={`py-2 px-3 rounded-lg text-sm ${ageRange === age.id ? 'bg-[#6C63FF] text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {age.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl mt-4"
                >
                  <X className="h-5 w-5 mr-2" />
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
              }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 group relative"
            >
              <div className="relative">
                <img
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-60 object-cover group-hover:opacity-90 transition-opacity cursor-zoom-in"
                  onClick={() => setSelectedImage(product.image)}
                />
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-[#6C63FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                    New
                  </span>
                )}
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
              </div>
              
              <div className="p-5">
                <h3 className="text-gray-800 font-medium mb-2 line-clamp-1">{product.name}</h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={16}
                        className={`${i < (product.rating || 4) ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({product.reviews || 24})</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[#6C63FF] font-bold text-lg">₹{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-gray-400 text-sm line-through">₹{product.originalPrice}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
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
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-12 text-center"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#f3e8ff] mb-4">
            <Search className="h-8 w-8 text-[#6C63FF]" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-[#6C63FF] to-[#4b2990] hover:opacity-90 transition-opacity"
          >
            Reset all filters
          </button>
        </motion.div>
      )}

      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}

export default Products;
