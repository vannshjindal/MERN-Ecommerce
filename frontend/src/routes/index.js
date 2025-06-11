import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import Cart from "../pages/cart";
import MyProfile from "../pages/MyProfile";   
import ProtectedRoute from "./protectedRoutes"; 
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/home",
        element: <ProtectedRoute><Home /></ProtectedRoute>, 
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/cart",
        element: <ProtectedRoute><Cart /></ProtectedRoute>, 
      },
      {
        path: "/myprofile",
        element: <ProtectedRoute><MyProfile /></ProtectedRoute>, 
      },
      {
        path: "/product/:productId",
        element: <ProductDetails/>
      },
      {
        path: "/checkout",
        element: <ProtectedRoute><Checkout /></ProtectedRoute>, 
      },
      {
        path: "/order-confirmation",
        element: <ProtectedRoute><OrderConfirmation /></ProtectedRoute>,
      }
    ],
  },
]);

export default router;
