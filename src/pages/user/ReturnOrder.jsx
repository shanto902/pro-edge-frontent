const ReturnOrder = ({ 
  trackingId, 
  setTrackingId, 
  selectedOrder, 
  setSelectedOrder, 
  orders, 
  handleCancelOrder, 
  handleReturnOrder 
}) => {
  const handleTrackOrder = () => {
    const order = orders.find((o) => o.order_id === trackingId.trim());
    if (order) {
      setSelectedOrder(order);
      setTrackingId("");
    } else {
      alert("Order not found. Please check your order ID and try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Return Order</h2>
        <p className="text-gray-500 mt-2">
          To initiate a return, please enter your order ID Number or contact us at (phone) or by emailing us at (email)
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Order ID Number"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
        <button
          onClick={handleTrackOrder}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Find Order
        </button>
      </div>

      {selectedOrder && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Order Details</h3>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{selectedOrder.order_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{selectedOrder.order_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{selectedOrder.order_status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">${selectedOrder.subtotal}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleCancelOrder(selectedOrder)}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Cancel Order
            </button>
            <button
              onClick={() => handleReturnOrder(selectedOrder)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnOrder;