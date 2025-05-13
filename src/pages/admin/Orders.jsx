import { useState, useEffect, useContext } from "react";
import { Search, Package, AlertCircle, CheckCircle, XCircle, Clock, Truck, X, Filter, ChevronDown, ChevronRight, Eye } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllOrders, getOrderByClaimCode, updateOrderStatus } from "../../utils/orderUtils";

const AdminOrders = () => {
  const { getAuthHeader } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchClaimCode, setSearchClaimCode] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllOrders(getAuthHeader);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchClaimCode.trim()) {
      fetchOrders();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getOrderByClaimCode(searchClaimCode);
      if (result.success) {
        setOrders([result.data]);
      } else {
        setError(result.error);
        setOrders([]);
      }
    } catch (err) {
      setError("Failed to fetch order details");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessOrder = async (orderId) => {
    try {
      const result = await updateOrderStatus(orderId, "Processing", getAuthHeader());
      if (result.success) {
        // Refresh orders list
        fetchOrders();
        // Update selected order if it's the one being modified
        if (selectedOrder && selectedOrder.order.id === orderId) {
          setSelectedOrder(result.data);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to process order");
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      const result = await updateOrderStatus(orderId, "Delivered", getAuthHeader());
      if (result.success) {
        // Refresh orders list
        fetchOrders();
        // Update selected order if it's the one being modified
        if (selectedOrder && selectedOrder.order.id === orderId) {
          setSelectedOrder(result.data);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to update order status");
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(orderData => {
    if (statusFilter === "all") return true;
    return orderData.order.status.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="mr-2" />
              Order Management
            </h1>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={searchClaimCode}
                    onChange={(e) => setSearchClaimCode(e.target.value)}
                    placeholder="Search by claim code"
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                >
                  Search
                </button>
              </form>

              <div className="relative">
                <button 
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                >
                  <Filter size={18} className="mr-2" />
                  Filter
                  <ChevronDown size={18} className="ml-2" />
                </button>
                
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                    <div className="p-2">
                      <p className="text-sm font-medium text-gray-700 mb-2 px-2">Status</p>
                      <button 
                        onClick={() => { setStatusFilter("all"); setFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${statusFilter === "all" ? "bg-blue-50 text-blue-700" : ""}`}
                      >
                        All Orders
                      </button>
                      <button 
                        onClick={() => { setStatusFilter("processing"); setFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${statusFilter === "processing" ? "bg-blue-50 text-blue-700" : ""}`}
                      >
                        Processing
                      </button>
                      <button 
                        onClick={() => { setStatusFilter("delivered"); setFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${statusFilter === "delivered" ? "bg-blue-50 text-blue-700" : ""}`}
                      >
                        Delivered
                      </button>
                      <button 
                        onClick={() => { setStatusFilter("cancelled"); setFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${statusFilter === "cancelled" ? "bg-blue-50 text-blue-700" : ""}`}
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {statusFilter !== "all" && (
            <div className="mb-4 flex items-center">
              <span className="text-sm text-gray-500">Filtered by: </span>
              <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(statusFilter)}`}>
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </span>
              <button 
                onClick={() => setStatusFilter("all")}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex">
                <AlertCircle className="text-red-500 mr-3 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">No Orders Found</h2>
              <p className="text-gray-600">
                {searchClaimCode ? "Try a different claim code" : statusFilter !== "all" ? `No ${statusFilter} orders found` : "No orders have been placed yet"}
              </p>
              {(searchClaimCode || statusFilter !== "all") && (
                <button
                  onClick={() => { setSearchClaimCode(""); setStatusFilter("all"); fetchOrders(); }}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((orderData) => (
                      <tr key={orderData.order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{orderData.order.claimCode}
                          </div>
                          <div className="text-sm text-gray-500">
                            {orderData.books.length} {orderData.books.length === 1 ? 'item' : 'items'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{orderData.user.name}</div>
                          <div className="text-sm text-gray-500">{orderData.user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(orderData.order.status)}
                            <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(orderData.order.status)}`}>
                              {orderData.order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Rs {orderData.order.totalPrice.toFixed(2)}
                          </div>
                          {orderData.order.discountApplied > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              {orderData.order.discountApplied}% off
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(orderData.order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-3">
                            <button
                              onClick={() => setSelectedOrder(orderData)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye size={16} />
                              View
                            </button>
                            {orderData.order.status.toLowerCase() === "pending" && (
                              <button
                                onClick={() => handleProcessOrder(orderData.order.id)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Clock size={16} />
                                Process
                              </button>
                            )}
                            {orderData.order.status.toLowerCase() === "processing" && (
                              <button
                                onClick={() => handleMarkAsDelivered(orderData.order.id)}
                                className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors"
                              >
                                <Truck size={16} />
                                Deliver
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 p-6">
              <div className="flex items-center">
                <Package className="mr-3 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Order #{selectedOrder.order.claimCode}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="flex items-center mb-6">
                <div className={`px-3 py-1 text-sm font-medium rounded-full flex items-center ${getStatusColor(selectedOrder.order.status)}`}>
                  {getStatusIcon(selectedOrder.order.status)}
                  <span className="ml-2">{selectedOrder.order.status}</span>
                </div>
                
                {selectedOrder.order.status.toLowerCase() === "pending" && (
                  <button
                    onClick={() => handleProcessOrder(selectedOrder.order.id)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                  >
                    <Clock size={16} className="mr-2" />
                    Process Order
                  </button>
                )}
                {selectedOrder.order.status.toLowerCase() === "processing" && (
                  <button
                    onClick={() => handleMarkAsDelivered(selectedOrder.order.id)}
                    className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                  >
                    <Truck size={16} className="mr-2" />
                    Mark as Delivered
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <ChevronRight className="mr-1 text-blue-600" size={20} />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-20">Name:</span>
                      <span className="text-gray-900">{selectedOrder.user.name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-20">Email:</span>
                      <span className="text-gray-900">{selectedOrder.user.email}</span>
                    </div>
                    {selectedOrder.user.phone && (
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-20">Phone:</span>
                        <span className="text-gray-900">{selectedOrder.user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <ChevronRight className="mr-1 text-blue-600" size={20} />
                    Order Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">Order Date:</span>
                      <span className="text-gray-900">
                        {new Date(selectedOrder.order.orderDate).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-600 w-24">Total:</span>
                      <span className="text-gray-900 font-medium">Rs {selectedOrder.order.totalPrice.toFixed(2)}</span>
                    </div>
                    {selectedOrder.order.discountApplied > 0 && (
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-24">Discount:</span>
                        <span className="text-green-600 font-medium">{selectedOrder.order.discountApplied}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ChevronRight className="mr-1 text-blue-600" size={20} />
                  Order Items ({selectedOrder.books.length})
                </h3>
                <div className="space-y-4">
                  {selectedOrder.books.map((book) => (
                    <div key={book.id} className="flex items-center gap-6 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      {book.imageUrl && (
                        <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={`http://localhost:5001/api/Images/Books/${book.imageUrl}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900">{book.title}</h4>
                        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Qty: {book.quantity}</p>
                        <p className="font-medium text-gray-900">Rs {book.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Subtotal: Rs {(book.price * book.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;