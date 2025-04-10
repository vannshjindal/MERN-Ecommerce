// import React, { useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setUserDetails, clearUserDetails } from "../store/userSlice";
// import { Link, useNavigate } from "react-router-dom";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { GrSearch } from "react-icons/gr";
// import Logo from "./Logo";
// import { toast } from "react-toastify";
// import { MdShoppingCart } from "react-icons/md";

// const Header = () => {
//   const user = useSelector((state) => state.user.userDetails, (prev, next) => prev?._id === next?._id);
//   const cartItems = useSelector((state) => state.cart.items || []);

//   const [greeting, setGreeting] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dispatch = useDispatch();
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();
//   const [profilePicURL, setProfilePicURL] = useState("");
//   const backendURL = 'http://localhost:8080'; // Replace with your actual backend URL
//   const dropdownRef = useRef(null); // Ref to handle outside clicks

//   const getGreeting = () => {
//     const currentHour = new Date().getHours();
//     if (currentHour >= 5 && currentHour < 12) return "Good morning";
//     if (currentHour >= 12 && currentHour < 18) return "Good afternoon";
//     return "Good Evening";
//   };

//   useEffect(() => {
//     setGreeting(user ? `${getGreeting()}, ${user.name}!` : `${getGreeting()}, Guest!`);
//   }, [user]);

//   useEffect(() => {
//     if (user?.profilePicture) {
//       const filename = user.profilePicture.split('\\').pop();
//       setProfilePicURL(`${backendURL}/uploads/${filename}`);
//     } else {
//       setProfilePicURL("");
//     }
//   }, [user]);

//   const handleLogout = () => {
//     localStorage.removeItem("userId");
//     localStorage.removeItem("token");
//     dispatch(clearUserDetails());
//     toast.success("Successfully logged out!");
//     setIsDropdownOpen(false);
//     navigate("/login");
//   };

//   const handleSearch = (e) => {
//     setSearch(e.target.value);
//     if (e.target.value) {
//       navigate(`/search?q=${e.target.value}`);
//     } else {
//       navigate("/search");
//     }
//   };

//   const handleCartClick = () => {
//     navigate("/cart");
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownRef]);

//   return (
//     <header className="h-16 shadow-md bg-white fixed w-full z-40">
//       <div className="h-full container mx-auto flex items-center px-4 justify-between">
//         {/* Logo */}
//         <div>
//           <Link to={"/"}>
//             <Logo w={90} h={100} />
//           </Link>
//         </div>

//         {/* Search Bar */}
//         <div className="hidden lg:flex items-center w-full max-w-sm border rounded-full focus-within:shadow pl-3 pr-2 py-1">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full outline-none px-2 text-gray-700"
//             onChange={handleSearch}
//             value={search}
//           />
//           <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white cursor-pointer">
//             <GrSearch />
//           </div>
//         </div>

//         {/* User & Cart Section */}
//         <div className="flex items-center gap-6">
//           <div className="text-lg font-semibold text-gray-700">{greeting}</div>

//           {/* Profile Icon */}
//           <div
//             className="text-3xl cursor-pointer relative flex justify-center"
//             onClick={toggleDropdown} // Changed to onClick
//             ref={dropdownRef} // Added ref for outside click handling
//           >
//             {profilePicURL ? (
//               <img src={profilePicURL} className="w-10 h-10 rounded-full object-cover" alt={user?.name} />
//             ) : (
//               <FaRegCircleUser className="text-gray-700 text-4xl" />
//             )}

//             {/* Dropdown Menu */}
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 z-50 transform transition-all duration-300 ease-in-out top-full"> {/* Adjusted positioning */}
//                 <ul className="text-sm">
//                   <li>
//                     <Link
//                       to="/myprofile"
//                       className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
//                       onClick={() => setIsDropdownOpen(false)} // Close dropdown on link click
//                     >
//                       My Profile
//                     </Link>
//                   </li>
//                   <li>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
//                     >
//                       Logout
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Cart Icon */}
//           <div className="relative flex items-center">
//             <Link to="/cart">
//               <MdShoppingCart className="text-3xl text-gray-700" />
//               {cartItems.length > 0 && (
//                 <span className="absolute top-[-8px] right-[-8px] bg-red-600 text-white rounded-full text-[12px] font-semibold px-2 py-0.5">
//                   {cartItems.length}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails, clearUserDetails } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrSearch } from "react-icons/gr";
import { MdPersonOutline, MdLogout } from "react-icons/md";
import Logo from "./Logo";
import { toast } from "react-toastify";
import { MdShoppingCart } from "react-icons/md";

const Header = () => {
  const user = useSelector((state) => state.user.userDetails, (prev, next) => prev?._id === next?._id);
  const cartItems = useSelector((state) => state.cart.items || []);

  const [greeting, setGreeting] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [profilePicURL, setProfilePicURL] = useState("");
  const backendURL = 'http://localhost:8080';
  const dropdownRef = useRef(null);

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
    navigate("/login");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      navigate(`/search?q=${e.target.value}`);
    } else {
      navigate("/search");
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown on outside click
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

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        {/* Logo */}
        <div>
          <Link to={"/"}>
            <Logo w={90} h={100} />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center w-full max-w-sm border rounded-full focus-within:shadow pl-3 pr-2 py-1">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full outline-none px-2 text-gray-700"
            onChange={handleSearch}
            value={search}
          />
          <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white cursor-pointer">
            <GrSearch />
          </div>
        </div>

        {/* User & Cart Section */}
        <div className="flex items-center gap-6">
          <div className="text-lg font-semibold text-gray-700">{greeting}</div>

          {/* Profile Icon */}
          <div
            className="cursor-pointer relative flex justify-center"
            ref={dropdownRef}
          >
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center focus:outline-none"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              {profilePicURL ? (
                <img 
                  src={profilePicURL} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-red-600 transition-all duration-300" 
                  alt={user?.name} 
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors duration-300">
                  <FaRegCircleUser className="text-4xl" />
                </div>
              )}
            </button>

            {/* Enhanced Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out top-full ring-1 ring-black ring-opacity-5">
                {user ? (
                  <>
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        {profilePicURL ? (
                          <img 
                            src={profilePicURL} 
                            className="w-10 h-10 rounded-full object-cover mr-3" 
                            alt={user?.name} 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <FaRegCircleUser className="text-gray-600 text-xl" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/myprofile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <MdPersonOutline className="mr-3 text-lg" />
                        <span>My Profile</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <MdLogout className="mr-3 text-lg" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-3 px-4">
                    <Link
                      to="/login"
                      className="block w-full py-2 px-4 text-center bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 mb-2"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full py-2 px-4 text-center text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <div className="relative flex items-center">
            <Link 
              to="/cart"
              className="text-gray-700 hover:text-red-600 transition-colors duration-300"
            >
              <MdShoppingCart className="text-3xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs font-semibold w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;