import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle, CheckCircle, X } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthHeader } = useContext(AuthContext);
  const { cart, loading, error, fetchCart, updateItemQuantity, removeItem, clearCartItems } = useCart();
  const [updatingItem, setUpdatingItem] = useState(null);
  
  // Toast message state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success, error, info
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: "/cart" } });
      return;
    }
    fetchCart(getAuthHeader);
  }, [isAuthenticated, fetchCart, getAuthHeader]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItem(itemId);
    try {
      const cartItem = cart.cartItems.find(item => item.id === itemId);
      if (!cartItem) {
        showToast("Cart item not found", "error");
        return;
      }
      const result = await updateItemQuantity(cartItem.book.id, newQuantity, getAuthHeader);
      if (result.success) {
        showToast(`Updated "${cartItem.book.title}" quantity to ${newQuantity}`, "success");
      } else {
        showToast(result.error, "error");
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      showToast("Failed to update quantity", "error");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    try {
      const cartItem = cart.cartItems.find(item => item.id === itemId);
      if (!cartItem) {
        showToast("Cart item not found", "error");
        return;
      }
      const result = await removeItem(cartItem.book.id, getAuthHeader);
      if (result.success) {
        showToast(`"${cartItem.book.title}" removed from cart`, "success");
      } else {
        showToast(result.error, "error");
      }
    } catch (err) {
      console.error('Error removing item:', err);
      showToast("Failed to remove item", "error");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      const result = await clearCartItems(getAuthHeader);
      if (result.success) {
        showToast("Cart cleared successfully", "success");
      } else {
        showToast(result.error, "error");
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      showToast("Failed to clear cart", "error");
    }
  };

  // Calculate cart summary
  const calculateSummary = () => {
    if (!cart || !cart.cartItems) return null;

    let subtotal = 0;
    let totalDiscount = 0;

    cart.cartItems.forEach(item => {
      const price = item.book.price;
      const quantity = item.quantity;
      const discount = item.book.discountPercentage || 0;
      
      subtotal += price * quantity;
      totalDiscount += (price * discount / 100) * quantity;
    });

    return {
      subtotal,
      totalDiscount,
      grandTotal: subtotal - totalDiscount
    };
  };

  // Toast Component
  const ToastNotification = () => {
    if (!toast.show) return null;

    const bgColor = toast.type === "success" ? "bg-green-100" : 
                   toast.type === "error" ? "bg-red-100" : "bg-blue-100";
    
    const borderColor = toast.type === "success" ? "border-green-500" : 
                       toast.type === "error" ? "border-red-500" : "border-blue-500";
    
    const textColor = toast.type === "success" ? "text-green-800" : 
                     toast.type === "error" ? "text-red-800" : "text-blue-800";
    
    const Icon = toast.type === "success" ? CheckCircle : 
               toast.type === "error" ? AlertCircle : AlertCircle;

    return (
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md`}>
        <div className={`${bgColor} border-l-4 ${borderColor} p-4 rounded-lg shadow-lg flex items-center justify-between`}>
          <div className="flex items-center">
            <Icon className={`${textColor} mr-3`} size={20} />
            <p className={`${textColor} font-medium`}>{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast({...toast, show: false})}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black">
          Loading
        </div>
      </div>
    );
  }

  if (error && !toast.show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!cart || cart?.cartItems?.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ToastNotification />
        <ShoppingBag size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Add some books to your cart to continue shopping
        </p>
        <button
          onClick={() => navigate("/books")}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Browse Books
        </button>
      </div>
    );
  }

  const summary = calculateSummary();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastNotification />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 flex items-center"
          >
            <Trash2 size={20} className="mr-2" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex items-center">
                    <img
                      src={`http://localhost:5001/api/Images/Books/${item.book.frontImage}`}
                      alt={item.book.title}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.book.title}
                      </h3>
                      <p className="text-sm text-gray-500">ISBN: {item.book.isbn}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={updatingItem === item.id}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Minus size={20} />
                          </button>
                          <span className="mx-4 text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={
                              updatingItem === item.id ||
                              item.quantity >= item.book.stock
                            }
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900">
                            Rs {((item.book.price * (100 - item.book.discountPercentage) / 100) * item.quantity).toFixed(2)}
                          </p>
                          {item.book.discountPercentage > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                              Rs {(item.book.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-6 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    Rs {summary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Discount</span>
                  <span className="text-gray-900">
                    Rs {summary.totalDiscount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      Rs {summary.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;