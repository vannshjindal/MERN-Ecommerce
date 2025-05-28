import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateQuantity, removeFromCart } from "../store/cartSlice";
import { 
  MdRemove, 
  MdAdd, 
  MdDeleteOutline, 
  MdShoppingCart, 
  MdArrowBack,
  MdShoppingBag,
  MdLocalShipping,
  MdSecurity
} from "react-icons/md";
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcPaypal, 
  FaCcAmex,
  FaLock,
  FaShieldAlt
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const dispatch = useDispatch();
  const { items: cartItems, totalPrice, loading } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.userDetails);
  const navigate = useNavigate();
  const [isCheckoutHovered, setIsCheckoutHovered] = useState(false);
  const [animateTotal, setAnimateTotal] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user]);

  // Animation effect when total changes
  useEffect(() => {
    setAnimateTotal(true);
    const timer = setTimeout(() => setAnimateTotal(false), 500);
    return () => clearTimeout(timer);
  }, [totalPrice]);

  const handleIncrease = (item) => {
    const userId = user?._id;
    if (!userId) {
      toast.error("Please log in to update your cart");
      return;
    }

    const productId = item?.productId?._id || item?.productId;
    const payload = {
      userId,
      productId,
      quantity: item.quantity + 1,
    };

    dispatch(updateQuantity(payload));
    toast.success("Item quantity updated");
  };

  const handleDecrease = (item) => {
    const newQuantity = item.quantity - 1;

    if (newQuantity > 0) {
      dispatch(updateQuantity({
        userId: user._id,
        productId: item.productId._id || item.productId,
        quantity: newQuantity,
      }));
      toast.success("Item quantity updated");
    } else {
      handleRemove(item);
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart({
      userId: user._id,
      productId: item.productId._id || item.productId
    }));
    toast.info("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    
    setIsCheckoutHovered(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 300);
  };

  // Animated variants for item cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const renderEmptyCart = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-50 rounded-full scale-150 opacity-30"></div>
        <MdShoppingCart className="text-red-500 text-8xl relative z-10" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h3>
      <p className="text-gray-500 mb-10 text-center max-w-md px-6">
        Looks like you haven't added any products to your cart yet.
        Browse our collection and find something you'll love!
      </p>
      <Link to="/home" className="group flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
        <MdArrowBack className="mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Start Shopping</span>
      </Link>
    </motion.div>
  );

  // Calculate shipping and total
  const shipping = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + shipping;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Your Shopping Cart</h2>
        <div className="flex items-center justify-center">
          <MdShoppingBag className="text-red-500 mr-2" />
          <p className="text-gray-500">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-red-400 opacity-20"></div>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => {
                const product = item.productId || {};
                const productId = product._id || item.productId;
                const itemTotal = (product.price || 0) * item.quantity;

                return (
                  <motion.div
                    key={productId || index}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="group flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
                  >
                    {/* Product Image & Details */}
                    <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0 w-full md:w-auto">
                      <div className="relative">
                        <div className="overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300">
                          <img
                            src={product.image || "https://via.placeholder.com/150"}
                            alt={product.name || "Product"}
                            className="w-24 h-24 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-md"
                        >
                          {item.quantity}
                        </motion.span>
                      </div>
                      <div className="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name || "Unknown Product"}</h3>
                        <p className="text-gray-500 flex items-center justify-center md:justify-start">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Unit Price: ₹{product.price?.toLocaleString() || 0}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Controls and Price */}
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto mt-4 md:mt-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden shadow-sm">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDecrease(item)}
                          className="bg-gray-50 hover:bg-gray-100 px-3 py-2 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <MdRemove />
                        </motion.button>
                        <span className="px-4 py-2 font-medium min-w-[40px] text-center">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleIncrease(item)}
                          className="bg-gray-50 hover:bg-gray-100 px-3 py-2 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <MdAdd />
                        </motion.button>
                      </div>

                      {/* Price */}
                      <div className="text-lg font-bold text-gray-800 min-w-[80px] text-center">
                        ₹{itemTotal.toLocaleString()}
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(item)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Remove item"
                      >
                        <MdDeleteOutline size={24} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-4"
            >
              <h3 className="text-xl font-bold text-gray-800 flex items-center mb-6">
                <span className="bg-gray-100 p-2 rounded-lg mr-3">
                  <MdShoppingBag className="text-red-500" />
                </span>
                Order Summary
              </h3>
              
              <div className="space-y-3 max-h-80 overflow-auto pr-2 styled-scrollbar mb-6">
                {cartItems.map((item, index) => {
                  const product = item.productId || {};
                  const itemTotal = (product.price || 0) * item.quantity;
                  
                  return (
                    <div key={product._id || index} className="flex justify-between items-center text-gray-600 py-2 border-b border-gray-50 last:border-b-0">
                      <div className="flex items-center">
                        <span className="font-medium truncate max-w-[150px]">
                          {product.name || "Unknown Product"}
                        </span>
                        <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">×{item.quantity}</span>
                      </div>
                      <span>₹{itemTotal.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <motion.span
                    animate={{ scale: animateTotal ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ₹{totalPrice.toLocaleString()}
                  </motion.span>
                </div>
                <div className="flex justify-between text-gray-600 items-center">
                  <div className="flex items-center gap-1">
                    <span>Shipping</span>
                    <MdLocalShipping className="text-gray-400" />
                  </div>
                  <span className={shipping === 0 ? "text-green-500 font-medium" : ""}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-3 pt-3">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <motion.span
                      className="text-red-600"
                      animate={{ scale: animateTotal ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    >
                      ₹{finalTotal.toLocaleString()}
                    </motion.span>
                  </div>
                  {totalPrice > 0 && totalPrice < 500 && (
                    <div className="mt-2 text-xs text-gray-500 italic">
                      Add ₹{(500 - totalPrice).toLocaleString()} more to get free shipping
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className={`relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-6 py-4 rounded-lg w-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center overflow-hidden ${isCheckoutHovered ? 'from-green-600 to-green-700' : ''}`}
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">Proceed to Checkout</span>
                    <svg 
                      className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                  
                  {/* Animated background effect */}
                  <span className="absolute top-0 right-full h-full w-full bg-white opacity-20 transform skew-x-12 transition-transform duration-700 hover:translate-x-full z-0"></span>
                </motion.button>
                
                <Link 
                  to="/home" 
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg w-full block text-center transition-colors duration-300 flex items-center justify-center"
                >
                  <MdArrowBack className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-center">
                    <FaCcVisa size={28} className="text-blue-700" />
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-center">
                    <FaCcMastercard size={28} className="text-red-500" />
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-center">
                    <FaCcPaypal size={28} className="text-blue-800" />
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-center">
                    <FaCcAmex size={28} className="text-blue-500" />
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-gray-600 text-sm">
                    <div className="bg-gray-50 p-1 rounded-full mr-2">
                      <FaLock className="text-green-600" />
                    </div>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <div className="bg-gray-50 p-1 rounded-full mr-2">
                      <FaShieldAlt className="text-green-600" />
                    </div>
                    <span>Protected by 256-bit encryption</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <div className="bg-gray-50 p-1 rounded-full mr-2">
                      <MdSecurity className="text-green-600" />
                    </div>
                    <span>Money back guarantee</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Global CSS for styled scrollbar */}
      <style jsx global>{`
        .styled-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .styled-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c1c1c1;
        }
      `}</style>
    </div>
  );
};

export default Cart;