import React, { useState, useContext, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  User,
  LogOutIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { CartWishlistContext } from '../../context/CartWishlistContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const { cartCount, wishlistCount, clearWishlist, clearCartState } = useContext(CartWishlistContext);

  const navigate = useNavigate();
  const userMenuRef = useRef(null);

const handleLogout = () => {
  // Clear the wishlist and cart state FIRST (before logout)
  clearWishlist();
  clearCartState();
  // Then logout and navigate
  logout();
  navigate('/');
};

  /* --- Close user dropdown on outside click --- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

  const navItems = [
    { path: '/', name: 'Home' },
    { path: '/clothes', name: 'Clothes' },
    { path: '/toys', name: 'Toys' },
    { path: '/products', name: 'Products' },
    { path: '/about', name: 'About' },
    { path: '/orderpage', name: 'Orders' },
  ];

  return (
    <header className="bg-white shadow-md sticky  top-0 z-50 border-b border-[#f0f4f8]">
      {/* Announcement Bar */}
      {/* <motion.div
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: '100% 50%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          background:
            'linear-gradient(270deg, #A5D8FF, #B197FC, #FFD8A8, #A5D8FF)',
          backgroundSize: '300% 300%',
        }}
        className="relative overflow-hidden text-center py-1 text-sm font-medium text-[#2b2d42]"
      >
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]" />
        <div className="relative z-10">
          Free shipping on orders over ₹550 • Use code:{' '}
          <span className="font-bold">BABYLOVE</span>
        </div>
      </motion.div> */}

      {/* Main Header Row */}
      <div className="container mx-auto  px-4 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center group relative shrink-0"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute inset-0 scale-150 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <img
              src="/baby/Logobg.png"
              alt="Olea Baby Store"
              className="h-16 relative z-10 transition-all duration-500 group-hover:-rotate-3 group-hover:drop-shadow-2xl"
            />
            <motion.div
              className="absolute top-6 -right-3 text-pink-400"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <Heart className="w-4 h-4 fill-current" />
            </motion.div>
          </motion.div>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="absolute left-1/2  -translate-x-1/2 hidden lg:flex items-center bg-white/80 backdrop-blur-md rounded-full px-2 py-2 shadow-md border border-white/20">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'relative mx-1 px-4 py-2 text-sm font-medium rounded-full transition-all group',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Section: Icons + Auth */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-[#F8F9FA] transition-colors group"
            aria-label="Wishlist"
          >
            <Heart className="w-6 h-6 text-[#D6336C] group-hover:fill-[#D6336C]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D6336C] text-xs text-white animate-bounce">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className="relative p-2 rounded-full hover:bg-[#F8F9FA] transition-colors group"
            aria-label="Cart"
          >
            <ShoppingCart className="w-6 h-6 text-[#4263EB] group-hover:stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4263EB] text-xs text-white animate-bounce">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Auth Area */}
          {!isLoggedIn ? (
            <motion.div whileHover={{ scale: 1.05 }}>
              <NavLink
                to="/login"
                className="relative px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-blue-600  to-pink-600 text-white text-sm font-medium shadow-lg overflow-hidden group"
              >
                <motion.div
                  className="absolute bg-gradient-to-r from-pink-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
                <span className="relative z-10">Login</span>
              </NavLink>
            </motion.div>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <motion.button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 border border-gray-200/50 shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUserDropdownOpen((v) => !v)}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {user?.username?.charAt(0) ?? 'U'}
                </div>
                <span className="text-sm font-medium">
                  {user?.username?.split(' ')[0] ?? 'Account'}
                </span>
                <motion.svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </motion.button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200/50 bg-white/95 py-2 shadow-xl backdrop-blur-md z-50"
                  >
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200"
                    >
                      <LogOutIcon className="w-5 h-5" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full bg-[#F8F9FA] text-[#4263EB] focus:outline-none"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white shadow-xl rounded-b-2xl border-t border-[#F1F3F5]"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'px-4 py-3 font-medium rounded-lg flex items-center',
                      isActive
                        ? 'bg-[#E7F5FF] text-[#4263EB]'
                        : 'text-[#495057] hover:bg-[#F8F9FA]',
                    ].join(' ')
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Icons */}
              <div className="flex items-center justify-around px-4 py-3 border-t border-[#F1F3F5]">
                <NavLink
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative p-3 rounded-full hover:bg-[#F8F9FA] flex flex-col items-center"
                >
                  <Heart className="w-6 h-6 text-[#D6336C]" />
                  <span className="mt-1 text-xs text-[#868E96]">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D6336C] text-xs text-white">
                      {wishlistCount}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative p-3 rounded-full hover:bg-[#F8F9FA] flex flex-col items-center"
                >
                  <ShoppingCart className="w-6 h-6 text-[#4263EB]" />
                  <span className="mt-1 text-xs text-[#868E96]">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4263EB] text-xs text-white">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </div>

              {/* Mobile Auth */}
              <div className="pt-3 border-t border-[#F1F3F5]">
                {isLoggedIn ? (
                  <>
                    <div className="mb-2 flex items-center rounded-lg bg-[#F8F9FA] px-4 py-2">
                      <div className="mr-3 rounded-full bg-[#4263EB] p-2 text-white">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#212529]">
                          {user?.name || 'Welcome back!'}
                        </p>
                        <p className="text-xs text-[#868E96]">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#4263EB] to-[#748FFC] text-white font-medium hover:opacity-90 transition-colors flex items-center justify-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <NavLink
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center space-x-1 rounded-lg border border-[#4263EB] px-4 py-3 text-center font-medium text-[#4263EB] hover:bg-[#F8F9FA] transition-colors"
                    >
                      <User size={16} />
                      <span>Login</span>
                    </NavLink>
                    <NavLink
                      to="/registration"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg bg-gradient-to-r from-[#4263EB] to-[#748FFC] px-4 py-3 text-center font-medium text-white shadow transition-all hover:shadow-md"
                    >
                      Sign Up
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
