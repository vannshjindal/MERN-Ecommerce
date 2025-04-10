const backendDomain = "http://localhost:8080";

const SummaryApi = {
  signUP: {
    url: `${backendDomain}/api/signup`,
    method: "post",
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "post",
  },
  current_user: (userId) => ({
    url: `${backendDomain}/api/user-details/${userId}`,
    method: "get",
  }),
  get_products: {
    url: `${backendDomain}/api/products`,
    method: "get",
  },
  get_cart: (userId) => ({
    url: `${backendDomain}/api/cart/${userId}`,
    method: "get",
  }),
  add_to_cart: {
    url: `${backendDomain}/api/cart/add`,
    method: "post",
  },
  update_cart_item: {
    url: `${backendDomain}/api/cart/update`,
    method: "put",
  },
  remove_from_cart: (userId, productId) => ({
    url: `${backendDomain}/api/cart/remove/${userId}/${productId}`,
    method: "delete",
  }),
  clear_cart: (userId) => ({
    url: `${backendDomain}/api/cart/clear/${userId}`,
    method: "delete",
  }),
  get_single_product: (productId) => ({
    url: "",
    method: "GET",
  }),
  updateProfilePicture: (userId) => ({
    url: `${backendDomain}/api/user-details/${userId}/profile-picture`,
    method: "put",
  }),
  get_order_details: (orderId) => ({
    url: `${backendDomain}/api/orders/${orderId}`, // Replace with your actual API endpoint for fetching order details
    method: "GET",
  }),
  create_cod_order: { // Add this
    url: `${backendDomain}/api/orders/cod`,
    method: "post",
  },
};

export default SummaryApi;