import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

import Home from './pages/home/Home';
import About from './pages/home/About';
import Login from './pages/auth/Login';
import Registration from './pages/auth/Registration';
import Products from './pages/products/Products';
import Clothes from './pages/products/Clothes';
import Toys from './pages/products/Toys';
import Cart from './pages/carts/Cart';
import Wishlist from './pages/carts/Wishlist';
import Payment from './pages/orders/Payment';
import OrderPage from './pages/orders/OrderPage';

import Header from './components/user/Header';
import Footer from './components/user/Footer';
import ProductDetails from './components/user/ProductDetails';

import AdminDashboard from './components/admin/AdminDashboard';
import ManageProducts from './components/admin/ManageProducts';
import ManageOrders from './components/admin/ManageOrders';
import ManageUsers from './components/admin/ManageUsers';
import AddProduct from './components/admin/AddProducts';
import EditProduct from './components/admin/EditProducts';
import UpdateOrder from './components/admin/UpdateOrder';
import EditUser from './components/admin/EditUser';
import OrderDetails from './components/admin/OrderDetails';
import ForgetPassword from './pages/auth/ForgetPassword';


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const hideHeaderRoutes = ['/login', '/registration' , '/forgot-password'];
  const hideFooterRoutes = ['/login', '/registration' , '/forgot-password'];

  const shouldHideHeader = isAdminRoute || hideHeaderRoutes.includes(location.pathname);
  const shouldHideFooter = isAdminRoute || hideFooterRoutes.includes(location.pathname);


  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideHeader && <Header />}
      <main className="flex-1">

        <Routes>
          {/* user module */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/clothes" element={<Clothes />} />
          <Route path="/toys" element={<Toys />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/orderpage" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgetPassword />} />



          {/* admin module */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/orderdetails/:orderId" element={<AdminRoute><OrderDetails /></AdminRoute>} />
          <Route path="/admin/addproducts" element={<AdminRoute><AddProduct/></AdminRoute>}/>
          <Route path="/admin/editproduct/:id" element={<AdminRoute><EditProduct/></AdminRoute>}/>
          <Route path="/admin/updateorder/:id" element={<AdminRoute><UpdateOrder/></AdminRoute>}/>
          <Route path="/admin/edituser/:id" element={<AdminRoute><EditUser/></AdminRoute>}/>
        </Routes>

      </main>
      {!shouldHideFooter && <Footer />}
       <ToastContainer 
        position="top-right"
        autoClose={2000} 
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
