import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Phone, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

function Registration() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    terms: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(5, 'Name must be at least 5 characters').required('Full name is required'),
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, 'Password must contain uppercase, lowercase & number')
      .required('Password is required'),
    terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axiosInstance.post('/register/', {
        username: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        terms: values.terms,
      });

      resetForm();

      // Show success toast
      toast.success('Account created successfully! Welcome to our community.', {
        position: 'top-center',
        autoClose: 2500,
      });

      // Navigate directly to login page after registration
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.terms?.[0] ||
        error.response?.data?.message ||
        'Registration failed. Please try again.',
        { position: 'top-center', autoClose: 3000 }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <ToastContainer />
      
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
          
          {/* Animated gradient header */}
          <motion.div
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: '100% 50%' }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            style={{ background: 'linear-gradient(270deg, #6C63FF, #FF6B6B, #4FD1C5, #6C63FF)', backgroundSize: '300% 300%' }}
            className="p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
            <div className="relative z-10">
              <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-3xl font-bold text-white drop-shadow-md">
                Join Our Community
              </motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/90 mt-2 font-light">
                Create your account in seconds
              </motion.p>
            </div>
          </motion.div>

          {/* Form */}
          <div className="p-8">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    
                    {/* Name */}
                    <motion.div variants={itemVariants}>
                      <div className="relative">
                        <Field type="text" name="name" id="name" className="peer w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50" placeholder=" " />
                        <label htmlFor="name" className="absolute left-12 -top-2.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600">
                          Full Name
                        </label>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-500">
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                      <ErrorMessage name="name" component="div" className="mt-1 text-sm text-rose-500" />
                    </motion.div>

                    {/* Email */}
                    <motion.div variants={itemVariants}>
                      <div className="relative">
                        <Field type="email" name="email" id="email" className="peer w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50" placeholder=" " />
                        <label htmlFor="email" className="absolute left-12 -top-2.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600">
                          Email Address
                        </label>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-500">
                          <Mail className="h-5 w-5" />
                        </div>
                      </div>
                      <ErrorMessage name="email" component="div" className="mt-1 text-sm text-rose-500" />
                    </motion.div>

                    {/* Phone */}
                    <motion.div variants={itemVariants}>
                      <div className="relative">
                        <Field type="text" name="phone" id="phone" pattern="[0-9]*" inputMode="numeric" className="peer w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50" placeholder=" " />
                        <label htmlFor="phone" className="absolute left-12 -top-2.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600">
                          Phone Number
                        </label>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-500">
                          <Phone className="h-5 w-5" />
                        </div>
                      </div>
                      <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-rose-500" />
                    </motion.div>

                    {/* Password */}
                    <motion.div variants={itemVariants}>
                      <div className="relative">
                        <Field type={showPassword ? 'text' : 'password'} name="password" id="password" className="peer w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50" placeholder=" " />
                        <label htmlFor="password" className="absolute left-12 -top-2.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600">
                          Password
                        </label>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-500">
                          <Lock className="h-5 w-5" />
                        </div>
                      </div>
                      <ErrorMessage name="password" component="div" className="mt-1 text-sm text-rose-500" />
                    </motion.div>

                    {/* Terms */}
                    <motion.div variants={itemVariants} className="flex items-start">
                      <div className="flex items-center h-5">
                        <div onClick={() => { setIsChecked(!isChecked); setFieldValue('terms', !isChecked); }} className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}>
                          {isChecked && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <input type="checkbox" id="terms" name="terms" checked={isChecked} onChange={() => { setIsChecked(!isChecked); setFieldValue('terms', !isChecked); }} className="hidden" />
                      </div>
                      <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                        I agree to the <Link to="/terms" className="text-indigo-600 hover:text-indigo-800 font-medium">Terms and Conditions</Link>
                      </label>
                    </motion.div>
                    <ErrorMessage name="terms" component="div" className="text-sm text-rose-500" />

                    {/* Submit Button */}
                    <motion.div variants={itemVariants}>
                      <button type="submit" disabled={isSubmitting || !isChecked} className={`w-full py-3 px-4 rounded-xl text-sm font-medium text-white shadow-lg transition-all duration-300 ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl'}`}>
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                      </button>
                    </motion.div>
                  </motion.div>
                </Form>
              )}
            </Formik>

            {/* Login link */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                  Login
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Registration;