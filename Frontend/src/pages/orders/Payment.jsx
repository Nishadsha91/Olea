// Payment.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Lock, Shield } from 'lucide-react';
import { CartWishlistContext } from '../../context/CartWishlistContext';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosConfig';

export default function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { clearCart } = useContext(CartWishlistContext);

  
  const loadCart = async () => {
    try {
      const res = await axiosInstance.get('/cart/');
      setCartItems(res.data);
      const sum = res.data.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0);
      setTotal(sum);
      setShippingFee(sum > 2000 ? 0 : 50);
    } catch (err) {
      console.error('Failed to load cart', err.response || err);
      setCartItems([]);
      setTotal(0);
      setShippingFee(50);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleShippingChange = (e) => {
    const { id, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

const handlePayment = async (e) => {
  e.preventDefault();

  if (cartItems.length === 0) {
    toast.warning("Your cart is empty!");
    return;
  }

  if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
    toast.warning("Please fill in all shipping information");
    return;
  }

  setIsProcessing(true);

  try {
    let response;

    if (paymentMethod === 'cash') {
      response = await axiosInstance.post('/create-razorpay-order/', {
        payment_method: 'cash'
      });
      
      toast.success("Order placed successfully!");
      
      await clearCart();
      setCartItems([]);
      setTotal(0);
      
      // Navigate to order page
      navigate('/orderpage', { 
        state: { 
          orderDetails: response.data,
          message: "Order placed successfully! Pay when delivered."
        } 
      });

    } else if (paymentMethod === 'card' || paymentMethod === 'upi') {
      // For card/UPI - create Razorpay order first
      response = await axiosInstance.post('/create-razorpay-order/', {
        payment_method: paymentMethod
      });

      const { razorpay_order_id, amount, currency, key_id } = response.data;

      // Initialize Razorpay
      const options = {
        key: key_id,
        amount: amount * 100, // Amount in paise
        currency: currency,
        name: "Olea Store",
        description: "Order Payment",
        order_id: razorpay_order_id,
        handler: async function (razorpayResponse) {
          try {
            // Verify payment on backend
            const verifyResponse = await axiosInstance.post('/verify-razorpay-payment/', {
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature
            });

            toast.success("Payment successful! Order placed.");
            
            // Clear frontend cart
            await clearCart();
            setCartItems([]);
            setTotal(0);
            
            // Navigate to order page
            navigate('/orderpage', { 
              state: { 
                orderDetails: verifyResponse.data,
                message: "Payment successful! Order confirmed."
              } 
            });

          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: shippingInfo.fullName,
          contact: shippingInfo.phone,
        },
        theme: {
          color: "#6C63FF"
        },
        modal: {
          ondismiss: function() {
            toast.info("Payment cancelled");
            setIsProcessing(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } else {
      toast.error("Please select a payment method");
      return;
    }

  } catch (err) {
    console.error('Payment failed:', err.response || err);
    toast.error(err.response?.data?.error || "Failed to process payment");
  } finally {
    setIsProcessing(false);
  }
};

  const grandTotal = total + shippingFee;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#4b2990]">Order Summary</h2>
              </div>
              {cartItems.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600">Your cart is empty</p>
                  <Link 
                    to="/products" 
                    className="inline-block mt-4 bg-[#6C63FF] text-white px-4 py-2 rounded-lg hover:bg-[#4b2990] transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex">
                      <div className="flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                          <p className="ml-4 text-sm text-[#6C63FF] font-bold">₹{item.product.price}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="mt-1 text-sm text-gray-900">
                          Subtotal: ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#4b2990]">Payment Method</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-[#6C63FF] bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handlePaymentMethodChange('card')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => {}}
                        className="h-4 w-4 text-[#6C63FF] focus:ring-[#6C63FF]"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Credit/Debit Card
                      </label>
                    </div>
                  </div>

                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-[#6C63FF] bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handlePaymentMethodChange('upi')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => {}}
                        className="h-4 w-4 text-[#6C63FF] focus:ring-[#6C63FF]"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        UPI Payment
                      </label>
                    </div>
                  </div>

                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'cash' ? 'border-[#6C63FF] bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handlePaymentMethodChange('cash')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cash'}
                        onChange={() => {}}
                        className="h-4 w-4 text-[#6C63FF] focus:ring-[#6C63FF]"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#4b2990]">Shipping Information</h2>
              </div>
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address *
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Order Total & Payment */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#4b2990]">Order Total</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-[#6C63FF]">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Lock className="w-4 h-4 mr-2 text-[#6C63FF]" />
                  <span>Secure payment processing</span>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={cartItems.length === 0 || isProcessing}
                  className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#6C63FF] to-[#4b2990] hover:from-[#4b2990] hover:to-[#6C63FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF] transition-all ${
                    (cartItems.length === 0 || isProcessing) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {paymentMethod === 'cash' ? 'Place Order' : `Pay ₹${grandTotal.toFixed(2)}`}
                    </>
                  )}
                </button>
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <Shield className="w-4 h-4 mr-2 text-[#6C63FF]" />
                  <span>Your transaction is secured with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}