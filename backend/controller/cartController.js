const Cart = require("../models/cart");

const getCart = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch cart", error: error.message });
  }
};

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add product to cart", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: "Product not found in cart" });

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");

    res.json({ success: true, message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update cart" });
  }
};

const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.productId");

    res.json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};

const clearCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ success: true, message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
