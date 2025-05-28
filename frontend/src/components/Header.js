import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails, clearUserDetails } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrSearch } from "react-icons/gr";
import { MdPersonOutline, MdLogout, MdClose, MdMenu } from "react-icons/md";
import { HiOutlineHeart, HiOutlineBell } from "react-icons/hi";
import Logo from "./Logo";
import { toast } from "react-toastify";
import { MdShoppingCart } from "react-icons/md";

const Header = () => {
  const user = useSelector((state) => state.user.userDetails, (prev, next) => prev?._id === next?._id);
  const cartItems = useSelector((state) => state.cart.items || []);

  const [greeting, setGreeting] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [profilePicURL, setProfilePicURL] = useState("");
  const backendURL = 'http://localhost:8080';
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return "Good morning";
    if (currentHour >= 12 && currentHour < 18) return "Good afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    setGreeting(user ? `${getGreeting()}, ${user.name}!` : `${getGreeting()}, Guest!`);
  }, [user]);

  useEffect(() => {
    if (user?.profilePicture) {
      const filename = user.profilePicture.split('\\').pop();
      setProfilePicURL(`${backendURL}/uploads/${filename}`);
    } else {
      setProfilePicURL("");
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    dispatch(clearUserDetails());
    toast.success("Successfully logged out!");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const executeSearch = () => {
    if (search.trim()) {
      navigate(`/search?query=${search.trim()}`);
      setIsMobileMenuOpen(false);
    } else {
      navigate("/search");
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchRef.current?.focus();
  };

  const handleCartClick = () => {
    navigate("/cart");
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown and mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  return (
    <>
      <header className="h-16 lg:h-18 shadow-lg bg-white/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-100">
        <div className="h-full container mx-auto flex items-center px-4 lg:px-6 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={"/"} className="flex items-center hover:opacity-80 transition-opacity">
              <Logo w={90} h={100} />
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className={`flex items-center w-full bg-gray-50 rounded-full border-2 transition-all duration-300 ${
              isSearchFocused ? 'border-red-500 shadow-lg bg-white' : 'border-transparent hover:border-gray-200'
            }`}>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search for products, brands, categories..."
                className="w-full outline-none px-6 py-3 bg-transparent text-gray-700 placeholder-gray-400"
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && executeSearch()}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                value={search}
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 p-2 mr-2 transition-colors"
                >
                  <MdClose />
                </button>
              )}
              <button
                onClick={executeSearch}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full mr-2 transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-red-200"
              >
                <GrSearch className="text-lg" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Greeting */}
            <div className="text-sm font-medium text-gray-600 hidden xl:block">
              {greeting}
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center gap-4">
              {/* Notifications
              <button className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300">
                <HiOutlineBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button> */}

              {/* Wishlist */}
              {/* <button className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300">
                <HiOutlineHeart className="text-xl" />
              </button> */}

              {/* Cart */}
              <Link 
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 group"
              >
                <MdShoppingCart className="text-xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs font-semibold min-w-[20px] h-5 flex items-center justify-center px-1 group-hover:scale-110 transition-transform">
                    {getTotalCartItems()}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  {profilePicURL ? (
                    <img 
                      src={profilePicURL} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-red-500 transition-all duration-300" 
                      alt={user?.name} 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                      <FaRegCircleUser className="text-lg" />
                    </div>
                  )}
                </button>

                {/* Enhanced Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out border border-gray-100">
                    {user ? (
                      <>
                        {/* User Info Section */}
                        <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-100">
                          <div className="flex items-center">
                            {profilePicURL ? (
                              <img 
                                src={profilePicURL} 
                                className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-md" 
                                alt={user?.name} 
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mr-4 text-white shadow-md">
                                <FaRegCircleUser className="text-lg" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                              <p className="text-sm text-gray-600 truncate">{user.email}</p>
                              <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/myprofile"
                            className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <MdPersonOutline className="mr-3 text-lg group-hover:scale-110 transition-transform" />
                            <span className="font-medium">My Profile</span>
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                          >
                            <MdLogout className="mr-3 text-lg group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-4 px-6">
                        <div className="space-y-3">
                          <Link
                            to="/login"
                            className="block w-full py-3 px-4 text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            className="block w-full py-3 px-4 text-center text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 font-medium hover:shadow-md"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Create Account
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <Link 
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <MdShoppingCart className="text-2xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs font-semibold min-w-[18px] h-5 flex items-center justify-center px-1">
                  {getTotalCartItems()}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={toggleMobileMenu}></div>
          
          <div className="fixed top-16 right-0 w-80 max-w-[90vw] h-[calc(100vh-4rem)] bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto">
            <div className="p-6">
              {/* Mobile Search */}
              <div className="mb-6">
                <div className="flex items-center bg-gray-50 rounded-full border-2 border-transparent focus-within:border-red-500 focus-within:bg-white transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full outline-none px-4 py-3 bg-transparent text-gray-700 placeholder-gray-400"
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.key === "Enter" && executeSearch()}
                    value={search}
                  />
                  {search && (
                    <button
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-gray-600 p-2 transition-colors"
                    >
                      <MdClose />
                    </button>
                  )}
                  <button
                    onClick={executeSearch}
                    className="bg-red-600 text-white p-3 rounded-full mr-2 transition-colors hover:bg-red-700"
                  >
                    <GrSearch />
                  </button>
                </div>
              </div>

              {/* Mobile User Section */}
              {user ? (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    {profilePicURL ? (
                      <img 
                        src={profilePicURL} 
                        className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white shadow-md" 
                        alt={user?.name} 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mr-3 text-white shadow-md">
                        <FaRegCircleUser className="text-lg" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      to="/myprofile"
                      className="flex items-center py-2 px-3 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MdPersonOutline className="mr-3 text-lg" />
                      <span>My Profile</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full py-2 px-3 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-white"
                    >
                      <MdLogout className="mr-3 text-lg" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full py-3 text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full py-3 text-center text-red-600 border-2 border-red-600 rounded-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {/* Mobile Navigation Links */}
              {/* <div className="space-y-2">
                <Link
                  to="/wishlist"
                  className="flex items-center py-3 px-4 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HiOutlineHeart className="mr-3 text-xl" />
                  <span>Wishlist</span>
                </Link>
                
                <Link
                  to="/notifications"
                  className="flex items-center py-3 px-4 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HiOutlineBell className="mr-3 text-xl" />
                  <span>Notifications</span>
                  <span className="ml-auto bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;