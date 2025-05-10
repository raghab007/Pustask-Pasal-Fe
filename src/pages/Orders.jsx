import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { Package, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { getOrders, cancelOrder } from "../utils/orderUtils";

const Orders = () => {
  const navigate = useNavigate();
  const { getAuthHeader } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrders(getAuthHeader);
      if (result.success) {
        setOrders(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      const result = await cancelOrder(orderId, getAuthHeader);
      if (result.success) {
        // Refresh orders after cancellation
        await fetchOrders();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to cancel order");
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="text-green-500" />;
      case "processing":
        return <Clock className="text-blue-500" />;
      case "cancelled":
        return <XCircle className="text-red-500" />;
      default:
        return <AlertCircle className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Package size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
        <button
          onClick={() => navigate("/books")}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order #{order.claimCode}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.orderStatus)}
                    <span className="text-sm font-medium text-gray-900">
                      {getStatusText(order.orderStatus)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{item.book.title}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Rs {item.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      Rs {order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  {order.orderStatus.toLowerCase() === "pending" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingOrder === order.id}
                      className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 ${
                        cancellingOrder === order.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {cancellingOrder === order.id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                  {order.orderStatus.toLowerCase() === "delivered" && (
                    <button
                      onClick={() => {/* Handle reorder */}}
                      className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders; 