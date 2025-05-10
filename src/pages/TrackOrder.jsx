import { useState } from "react";
import { Package, Search, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { getOrderByClaimCode } from "../utils/orderUtils";

const TrackOrder = () => {
  const [claimCode, setClaimCode] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!claimCode.trim()) {
      setError("Please enter a claim code");
      return;
    }

    setLoading(true);
    setError(null);
    setOrderDetails(null);

    try {
      const result = await getOrderByClaimCode(claimCode);
      if (result.success) {
        setOrderDetails(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>
        
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={claimCode}
              onChange={(e) => setClaimCode(e.target.value)}
              placeholder="Enter your claim code (e.g., ALISH-20240315123456-XXXX)"
              className="flex-1 rounded-lg border-gray-300 focus:border-black focus:ring-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track Order"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <AlertCircle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Order Details */}
        {orderDetails && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Order Status */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order #{orderDetails.order.claimCode}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(orderDetails.order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(orderDetails.order.status)}
                  <span className="text-sm font-medium text-gray-900">
                    {orderDetails.order.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h3>
                <p className="text-sm text-gray-600">{orderDetails.user.name}</p>
                <p className="text-sm text-gray-600">{orderDetails.user.email}</p>
                <p className="text-sm text-gray-600">{orderDetails.user.phone}</p>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {orderDetails.books.map((book) => (
                    <div key={book.id} className="flex items-center space-x-4">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{book.title}</h4>
                        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                        <p className="text-sm text-gray-500">Quantity: {book.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Rs {book.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    Rs {orderDetails.order.totalPrice.toFixed(2)}
                  </span>
                </div>
                {orderDetails.order.discountApplied > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Discount Applied: {orderDetails.order.discountApplied}%
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && !orderDetails && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Order</h2>
            <p className="text-gray-600">
              Enter your claim code above to track your order status
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder; 