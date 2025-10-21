import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import { motion } from 'framer-motion';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const initialValues = { email: '', password: '', rememberMe: false  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
  });

const onSubmit = async (values, { setSubmitting }) => {
  try {
    const res = await axiosInstance.post('/login/', {
      email: values.email,
      password: values.password
    });

    const token = res.data.access;

    // ✅ Store token based on "Remember Me" choice
    if (values.rememberMe) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.setItem('accessToken', token);
    }

    // Also update context
    login(res.data.user, token, values.rememberMe);


    toast.success('Login successful!', { position: 'top-right', autoClose: 2000 });
    navigate('/');
  } catch (error) {
    toast.error(
      error.response?.data?.detail || 'Invalid credentials. Please try again.',
      { position: 'top-center', autoClose: 3000 }
    );
  } finally {
    setSubmitting(false);
  }
};

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
          {/* Animated gradient header */}
          <motion.div 
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: '100% 50%' }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear'
            }}
            style={{
              background: 'linear-gradient(270deg, #6C63FF, #FF6B6B, #4FD1C5, #6C63FF)',
              backgroundSize: '300% 300%'
            }}
            className="p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
            <div className="relative z-10">
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white drop-shadow-md"
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 mt-2 font-light"
              >
                Sign in to continue your journey
              </motion.p>
            </div>
          </motion.div>

          {/* Form */}
          <div className="p-8">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {/* Email */}
                    <motion.div variants={itemVariants}>
                      <div className="relative">
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className="peer w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50"
                          placeholder=" "
                        />
                        <label 
                          htmlFor="email"
                          className="absolute left-12 -top-2.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                        >
                          Email Address
                        </label>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-500">
                          <Mail className="h-5 w-5" />
                        </div>
                      </div>
                      <ErrorMessage name="email" component="div" className="mt-1 text-sm text-rose-500" />
                    </motion.div>

                    {/* Password */}
                    <motion.div variants={itemVariants}>
                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          className="peer w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50"
                          placeholder=" "
                        />
                        <label 
                          htmlFor="password"
                          className="absolute left-12 -top-2.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                        >
                          Password
                        </label>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-500">
                          <Lock className="h-5 w-5" />
                        </div>
                      </div>
                      <ErrorMessage name="password" component="div" className="mt-1 text-sm text-rose-500" />
                    </motion.div>

                    {/* Remember me & Forgot password */}
                    <motion.div 
                      variants={itemVariants}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Field
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            className="h-5 w-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                            Remember me
                          </label>

                      </div>

                      <div className="text-sm">
                          <Link 
                            to="/forgot-password" 
                            className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors relative group"
                          >
                            Forgot password?
                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                          </Link>
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div 
                      variants={itemVariants}
                      onHoverStart={() => setIsHovered(true)}
                      onHoverEnd={() => setIsHovered(false)}
                    >
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-medium text-white shadow-lg transition-all duration-300 ${
                          isSubmitting 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span className="mr-2">Sign In</span>
                            <motion.div
                              animate={{ x: isHovered ? 5 : 0 }}
                              transition={{ type: 'spring', stiffness: 500 }}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </motion.div>
                          </div>
                        )}
                      </button>
                    </motion.div>
                  </motion.div>
                </Form>
              )}
            </Formik>

            {/* Sign up link */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/registration" 
                  className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors relative group"
                >
                  Sign up
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;