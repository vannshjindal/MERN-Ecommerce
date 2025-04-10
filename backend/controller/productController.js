const Product = require('../models/product');

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// Add a new product
const createProduct = async (req, res) => {
  const { name, description, price, image, category } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
    });

    await newProduct.save();
    res.json({ success: true, message: 'Product added successfully', data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add product' });
  }
};
const getSingleProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Export functions properly
module.exports = {
  getAllProducts,
  createProduct,
  getSingleProduct
};
