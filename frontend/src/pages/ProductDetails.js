import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { HiShoppingCart } from "react-icons/hi";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
        try {
          const res = await fetch(`${SummaryApi.getSingleProducts.url}/${productId}`, {
            method: SummaryApi.get_single_product.method,
          });
      
          const data = await res.json();
      
          if (data.success) {
            setProduct(data.data); 
          } else {
            console.error("Failed to fetch product:", data.message);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    const userId = localStorage.getItem("userId");
    const quantity = 1;

    if (!userId || !productId) return;
    dispatch(addToCart({ userId, productId, quantity }));
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img src={product.image} alt={product.name} className="w-full md:w-1/2 rounded-lg shadow" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{product.description}</p>
          <p className="text-2xl text-teal-600 mt-4 font-semibold">₹{product.price}</p>
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
          >
            <HiShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
