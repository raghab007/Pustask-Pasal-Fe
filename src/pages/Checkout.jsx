import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { AlertCircle, CheckCircle, X, CreditCard, Truck, MapPin, ShoppingBag } from "lucide-react";
import { placeOrder } from "../utils/orderUtils";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading, error, clearCartItems } = useCart();
  const { user, getAuthHeader } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Auto-hide toast after 3 seconds
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
    setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 3000);
  };

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === "card") {
      setCardDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setShippingAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      // Validate shipping address
      const requiredFields = ["fullName", "address", "city", "state", "postalCode", "phone"];
      const missingFields = requiredFields.filter((field) => !shippingAddress[field]);
      if (missingFields.length > 0) {
        showToast("Please fill in all shipping details", "error");
        return false;
      }
    } else if (currentStep === 2) {
      // Validate payment details
      if (paymentMethod === "card") {
        const requiredFields = ["cardNumber", "cardName", "expiryDate", "cvv"];
        const missingFields = requiredFields.filter((field) => !cardDetails[field]);
        if (missingFields.length > 0) {
          showToast("Please fill in all card details", "error");
          return false;
        }
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (!validateStep()) {
      return;
    }

    try {
      const result = await placeOrder(getAuthHeader);
      if (result.success) {
        showToast("Order placed successfully!", "success");
        // Clear cart after successful order
        await clearCartItems(getAuthHeader);
        setTimeout(() => {
          navigate("/order-confirmation", { 
            state: { 
              orderDetails: {
                claimCode: result.data.claimCode,
                orderDate: result.data.createdDate,
                totalPrice: result.data.totalPrice
              }
            } 
          });
        }, 2000);
      } else {
        showToast(result.error || "Failed to place order", "error");
      }
    } catch (error) {
      showToast("Failed to place order", "error");
    }
  };

  // Calculate order summary
  const calculateSummary = () => {
    if (!cart || !cart.cartItems) return null;

    let subtotal = 0;
    let totalDiscount = 0;

    cart.cartItems.forEach((item) => {
      const price = item.book.price;
      const quantity = item.quantity;
      const discount = item.book.discountPercentage || 0;

      subtotal += price * quantity;
      totalDiscount += (price * discount / 100) * quantity;
    });

    return {
      subtotal,
      totalDiscount,
      grandTotal: subtotal - totalDiscount,
    };
  };

  const summary = calculateSummary();

  // Toast Component
  const ToastNotification = () => {
    if (!toast.show) return null;

    const bgColor = toast.type === "success" ? "bg-green-100" : "bg-red-100";
    const borderColor = toast.type === "success" ? "border-green-500" : "border-red-500";
    const textColor = toast.type === "success" ? "text-green-800" : "text-red-800";
    const Icon = toast.type === "success" ? CheckCircle : AlertCircle;

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
        <div className={`${bgColor} border-l-4 ${borderColor} p-4 rounded-lg shadow-lg flex items-center justify-between`}>
          <div className="flex items-center">
            <Icon className={`${textColor} mr-3`} size={20} />
            <p className={`${textColor} font-medium`}>{toast.message}</p>
          </div>
          <button onClick={() => setToast({ ...toast, show: false })} className="text-gray-500 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black">Loading</div>
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

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some books to your cart to proceed with checkout</p>
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
      <ToastNotification />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? "text-black" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-black text-white" : "bg-gray-200"
              }`}>
                1
              </div>
              <span className="ml-2">Shipping</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200">
              <div className={`h-full ${currentStep >= 2 ? "bg-black" : "bg-gray-200"}`}></div>
            </div>
            <div className={`flex items-center ${currentStep >= 2 ? "text-black" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-black text-white" : "bg-gray-200"
              }`}>
                2
              </div>
              <span className="ml-2">Payment</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200">
              <div className={`h-full ${currentStep >= 3 ? "bg-black" : "bg-gray-200"}`}></div>
            </div>
            <div className={`flex items-center ${currentStep >= 3 ? "text-black" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? "bg-black text-white" : "bg-gray-200"
              }`}>
                3
              </div>
              <span className="ml-2">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={shippingAddress.address}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`flex-1 p-4 border rounded-lg ${
                          paymentMethod === "card" ? "border-black" : "border-gray-200"
                        }`}
                      >
                        <CreditCard className="mx-auto mb-2" />
                        <span>Credit Card</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex-1 p-4 border rounded-lg ${
                          paymentMethod === "cod" ? "border-black" : "border-gray-200"
                        }`}
                      >
                        <Truck className="mx-auto mb-2" />
                        <span>Cash on Delivery</span>
                      </button>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Card Number</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={(e) => handleInputChange(e, "card")}
                            placeholder="1234 5678 9012 3456"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                          <input
                            type="text"
                            name="cardName"
                            value={cardDetails.cardName}
                            onChange={(e) => handleInputChange(e, "card")}
                            placeholder="John Doe"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={cardDetails.expiryDate}
                              onChange={(e) => handleInputChange(e, "card")}
                              placeholder="MM/YY"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">CVV</label>
                            <input
                              type="text"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={(e) => handleInputChange(e, "card")}
                              placeholder="123"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Review Order</h2>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.address}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <p>{paymentMethod === "card" ? "Credit Card" : "Cash on Delivery"}</p>
                      {paymentMethod === "card" && (
                        <p>Card ending in {cardDetails.cardNumber.slice(-4)}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Order Items</h3>
                      <div className="space-y-2">
                        {cart.cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>
                              {item.book.title} x {item.quantity}
                            </span>
                            <span>
                              Rs {((item.book.price * (100 - item.book.discountPercentage) / 100) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 ml-auto"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 ml-auto"
                  >
                    Place Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">Rs {summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Discount</span>
                  <span className="text-gray-900">Rs {summary.totalDiscount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-medium text-gray-900">
                      Rs {summary.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 