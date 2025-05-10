import { useNavigate, useLocation } from "react-router";
import { CheckCircle, Copy } from "lucide-react";
import { useState } from "react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // Get order details from location state
  const orderDetails = location.state?.orderDetails;

  const handleCopyClaimCode = () => {
    if (orderDetails?.claimCode) {
      navigator.clipboard.writeText(orderDetails.claimCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>

          {orderDetails?.claimCode && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Your Claim Code</p>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-lg font-mono bg-gray-100 px-4 py-2 rounded">
                  {orderDetails.claimCode}
                </code>
                <button
                  onClick={handleCopyClaimCode}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={20} className={copied ? "text-green-500" : "text-gray-500"} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Use this code to track your order status
              </p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => navigate("/orders")}
              className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Orders
            </button>
            {orderDetails?.claimCode && (
              <button
                onClick={() => navigate("/track-order", { state: { claimCode: orderDetails.claimCode } })}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Track Order
              </button>
            )}
            <button
              onClick={() => navigate("/books")}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 