const Product = require('../models/product'); 

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: err.message });
  }
};


const createProduct = async (req, res) => {
  const { name, description, price, image, category } = req.body;

  
  if (!name || !price || !description || !image || !category) {
    return res.status(400).json({ success: false, message: "All product fields are required." });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product added successfully', data: newProduct });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ success: false, message: 'Failed to add product', error: err.message });
  }
};


const getSingleProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product }); 
  } catch (err) {
    console.error("Error getting single product:", err);
   
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: "Invalid product ID format." });
    }
    res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
  }
};


const searchProducts = async (req, res) => {
  const { query } = req.query; 
  console.log(`Received search request with query: "${query}"`); 

  if (!query || query.trim() === '') {
    return res.status(400).json({ success: false, message: "Query parameter is required and cannot be empty." });
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },     
        { category: { $regex: query, $options: "i" } } 
      ]
    });
    console.log(`Found ${products.length} products for query: "${query}"`); 
    res.json({ success: true, products: products }); 
  } catch (err) {
    console.error("Search error:", err); 
    res.status(500).json({ success: false, message: "Search failed", error: err.message });
  }
};
module.exports = {
  getAllProducts,
  createProduct,
  getSingleProduct,
  searchProducts
};
