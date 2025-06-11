const Order = require('../models/orderModel');

exports.getOrderDetails = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findOne({ orderId: orderId }); 
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ data: order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};

exports.createCODOrder = async (req, res) => {
  console.log("createCODOrder function has been hit!");
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, subtotal, shippingFee, tax, userId } = req.body;

    
    const orderId = `COD-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const orderItems = items.map(item => ({
      productId: item.productId,
      name: item.productId.name, 
      quantity: item.quantity,
      price: item.productId.price, 
    }));
    
    const newOrder = new Order({
      userId: userId,
      items: orderItems,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India', 
      },
      paymentMethod: 'Cash on Delivery', 
      orderId: orderId,
      subtotal: subtotal,
      shippingFee: shippingFee,
      totalAmount: totalAmount,
      orderStatus: 'Pending',
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ message: 'COD order created successfully', orderId: savedOrder.orderId });

  } catch (error) {
    console.error('Error creating COD order:', error);
    res.status(500).json({ message: 'Failed to create COD order', error: error.message });
  }
};
