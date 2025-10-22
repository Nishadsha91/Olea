import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosConfig"; 

export const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadCartCount();
      loadWishlist();
    } else {
      setWishlist([]);
      setWishlistCount(0);
      setCartCount(0);
    }
  }, [user]);


  const loadCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await axiosInstance.get("/cart/");
      const count = res.data.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(count);
    } catch (err) {
      console.error("Failed to load cart count", err.response || err);
      setCartCount(0);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please login first!");
      return;
    }

    try {
      await axiosInstance.post("/cart/", {
        product_id: product.id,
        quantity: 1,
      });

      await loadCartCount();
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Add to cart failed", err.response || err);
      
      if (err.response?.status === 400) {
        toast.info("Product already in cart!");
      } else if (err.response?.status === 401) {
        toast.error("Please login again.");
      } else {
        toast.error("Failed to add to cart. Please try again.");
      }
    }
  };

  const clearCart = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await axiosInstance.get("/cart/");
      await Promise.all(res.data.map((item) => axiosInstance.delete(`/cart/${item.id}/`)));
      setCartCount(0);
      toast.success("Cart cleared successfully!");
    } catch (err) {
      console.error("Clear cart failed", err.response || err);
      setCartCount(0);
      toast.error("Failed to clear cart");
    }
  };

  const clearCartState = () => {
    setCartCount(0);
  };


  const loadWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setWishlistCount(0);
      return;
    }
    try {
      const res = await axiosInstance.get("/wishlist/");
      setWishlist(res.data);
      setWishlistCount(res.data.length);
    } catch (err) {
      console.error("Failed to load wishlist", err.response || err);
      setWishlist([]);
      setWishlistCount(0);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      toast.warning("Please login to use wishlist!");
      return;
    }

    try {
      await axiosInstance.post("/wishlist/", { product_id: product.id });
      await loadWishlist();
      toast.success("Added to wishlist!");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.info("Product already in wishlist!");
      } else if (err.response?.status === 401) {
        toast.error("Please login again.");
      } else {
        toast.error("Failed to add to wishlist");
      }
      console.error("Add to wishlist failed", err.response || err);
    }
  };

  const removeFromWishlist = async (id) => {
    if (!user) {
      setWishlist(prev => prev.filter(item => item.id !== id));
      setWishlistCount(prev => prev - 1);
      return;
    }
    try {
      await axiosInstance.delete(`/wishlist/${id}/`);
      await loadWishlist();
      toast.info("Removed from wishlist");
    } catch (err) {
      console.error("Remove from wishlist failed", err.response || err);
      setWishlist(prev => prev.filter(item => item.id !== id));
      setWishlistCount(prev => prev - 1);
      toast.error("Failed to remove from wishlist");
    }
  };

  const clearWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setWishlistCount(0);
      return;
    }
    try {
      const res = await axiosInstance.get("/wishlist/");
      await Promise.all(res.data.map((item) => axiosInstance.delete(`/wishlist/${item.id}/`)));
      setWishlist([]);
      setWishlistCount(0);
    } catch (err) {
      console.error("Clear wishlist failed", err.response || err);
      setWishlist([]);
      setWishlistCount(0);
    }
  };

  return (
    <CartWishlistContext.Provider
      value={{
        loadWishlist,
        cartCount,
        wishlist,
        wishlistCount,
        addToCart,
        clearCart,
        clearCartState,
        loadCartCount,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};