import React, { useState, useEffect } from 'react';
import loginIcons from '../assest/assest/signin.gif';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/cartSlice'; 
import { fetchUserDetails } from '../store/userSlice'; 

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        identifier: "",
        password: ""
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.user.userDetails); 
    
    useEffect(() => {
        if (userDetails) {
            navigate("/home");
        }
    }, [userDetails, navigate]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const dataApi = await dataResponse.json();

            if (dataApi.success) {
                console.log("User ID:", dataApi.data?._id); 

                if (dataApi.data?._id) {
                    localStorage.setItem("userId", dataApi.data._id); 
                    localStorage.setItem("token", dataApi.token); 
                    
                    // Dispatch Redux actions
                    dispatch(fetchUserDetails(dataApi.data._id));
                    dispatch(fetchCart(dataApi.data._id));
                } else {
                    console.error("No userId in API response!");
                }

                toast.success(dataApi.message);
                navigate("/home");
            } else if (dataApi.error) {
                toast.error(dataApi.message);
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-2">
                        <img src={loginIcons} alt="login icons" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome!</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Email or Phone</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="identifier"
                                    type="text"
                                    name="identifier"
                                    value={data.identifier}
                                    onChange={handleOnChange}
                                    required
                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md bg-gray-50"
                                    placeholder="Enter email or phone number"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex justify-between">
                                <span>Password</span>
                                <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-500 font-medium">
                                    Forgot password?
                                </Link>
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={handleOnChange}
                                    required
                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md bg-gray-50"
                                    placeholder="Enter your password"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : "Sign In"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/sign-up" className="font-medium text-red-600 hover:text-red-500">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;