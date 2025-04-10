import React, { useEffect, useState } from "react";
import { HiShoppingCart, HiOutlineHeart, HiStar } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../store/cartSlice";
import SummaryApi from "../common";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(SummaryApi.get_products.url, {
          method: SummaryApi.get_products.method,
          credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
          
          
          const uniqueCategories = [...new Set(data.data.map(product => product.category || "Uncategorized"))];
          setCategories(uniqueCategories);
        } else {
          console.error("Failed to load products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch]);

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const userId = localStorage.getItem("userId");
    const quantity = 1;

    if (!userId || !productId) {
      console.error("Missing userId or productId");
      return;
    }

    dispatch(addToCart({ userId, productId, quantity }));
    
   
    const button = e.currentTarget;
    button.classList.add("animate-pulse", "bg-green-600");
    setTimeout(() => {
      button.classList.remove("animate-pulse", "bg-green-600");
    }, 1000);
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 4);
    const hasHalfStar = (rating || 4) - fullStars >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<HiStar key={i} className="text-yellow-400 inline-block" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<HiStar key={i} className="text-yellow-400 inline-block opacity-60" />);
      } else {
        stars.push(<HiStar key={i} className="text-gray-300 inline-block" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="relative">
        <Slider {...sliderSettings} className="hero-slider">
          <div className="relative h-96 md:h-[500px]">
            <img
              src="https://images.pexels.com/photos/4473400/pexels-photo-4473400.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Slide 1"
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col items-start justify-center px-8 md:px-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white max-w-lg mb-4">Welcome to Our Premium Collection</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-md mb-6">Discover quality products crafted with excellence</p>
              
            </div>
          </div>

          <div className="relative h-96 md:h-[500px]">
            <img
              src="https://images.pexels.com/photos/5556302/pexels-photo-5556302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Slide 2"
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col items-start justify-center px-8 md:px-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white max-w-lg mb-4">Exclusive Season Discounts</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-md mb-6">Up to 50% off on our curated selections</p>
              
            </div>
          </div>

          <div className="relative h-96 md:h-[500px]">
            <img
              src="https://images.pexels.com/photos/2300334/pexels-photo-2300334.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Slide 3"
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col items-start justify-center px-8 md:px-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white max-w-lg mb-4">New Season Arrivals</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-md mb-6">Be the first to explore our latest collection</p>
             
            </div>
          </div>
        </Slider>
      </div>

      
      <div className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center">
              <div className="text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Quality Products</h3>
                <p className="text-sm text-gray-600">Premium selection</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Within 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Our Products</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${selectedCategory === "all" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            >
              All Products
            </button>
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${selectedCategory === category 
                    ? "bg-red-600 text-white" 
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-60 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">We couldn't find any products in this category.</p>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 no-underline transform hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors duration-300">
                          <HiOutlineHeart className="h-5 w-5" />
                        </button>
                      </div>
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-1 text-xs text-gray-500">{product.category || "General"}</div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">{product.name}</h3>
                      <div className="mb-2">
                        {renderStars(product.rating)}
                        <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-lg font-bold text-gray-800">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                          )}
                        </div>
                        {cartItems.some(item => item.productId === product._id) && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">In Cart</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(product._id, e)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <HiShoppingCart className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Collection Banner */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Featured Collection" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-red-500 font-semibold mb-2">Featured Collection</h3>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Summer Essentials</h2>
              <p className="text-gray-300 mb-6">Discover our curated collection of must-have items for the season. Perfect for every occasion.</p>
              <button className="bg-white text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-md font-semibold transition-all duration-300 self-start">
                Shop Collection
              </button>
            </div>
          </div>
        </div>
      </div>

     
     
    </div>
  );
};

export default Home;