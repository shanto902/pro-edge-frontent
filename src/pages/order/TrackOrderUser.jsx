import { useState } from "react";
import { useOrderContext } from "../../context/OrderContext";
import OrderDetailsModal from "../../components/order/OrderDetails";

const TrackOrderUser = ({ pageInfo }) => {
  const { orders } = useOrderContext();
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");

  const handleFindOrder = () => {
    setError(""); // Clear previous errors
    
    // Validate order number format
    if (!orderNumber.trim()) {
      setError("Please enter an order ID number.");
      return;
    }

    // Find the order
    const order = orders.find(
      (o) => o.order_id.toLowerCase() === orderNumber.trim().toLowerCase()
    );

    if (order) {
      setSelectedOrder(order);
      setShowDetails(true);
      setOrderNumber("");
    } else {
      setError("Order not found. Please check your order number and try again.");
    }
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-sm">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {pageInfo.title}
          </h2>
          <p className="text-gray-600">{pageInfo.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="order-number" className="block text-sm font-medium text-gray-700 mb-1">
              Order ID Number
            </label>
            <input
              type="text"
              id="order-number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order ID Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#182B55] focus:border-[#182B55]"
            />
            <p className="mt-1 text-xs text-gray-500">Please check your order confirmation email to find your order ID number.</p>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={handleFindOrder}
            className="w-full bg-[#182B55] hover:bg-blue-900 text-white font-medium py-3 px-4 rounded-md transition duration-200"
          >
            Find Order
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default TrackOrderUser;