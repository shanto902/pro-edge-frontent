import { useContext, useEffect, useState } from "react";
import OrderDataTable from "../../components/order/OrderDataTable";
import OrderDetailsModal from "../../components/order/OrderDetails";
import TrackOrderModal from "../../components/order/TrackOrder";
import { useOrderContext } from "../../context/OrderContext";
import { CartContext } from "../../context/CartContext";

const OrderTablePage = () => {
  const { orders, fetchOrders } = useOrderContext();
  const { clearCart } = useContext(CartContext);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    clearCart();
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleTrackOrder = () => {
    const order = orders.find((o) => o.order_id === trackingId.trim());
    if (order) {
      setSelectedOrder(order);
      setShowTrackModal(false);
      setShowDetails(true);
      setTrackingId(""); // reset
    } else {
      alert("Order ID not found");
    }
    if (order) {
      setSelectedOrder(order);
      setShowTrackModal(false);
      setShowDetails(true);
      setTrackingId(""); // reset
    } else {
      alert("Order ID not found");
    }
  };
  // console.log(orders, "orders");
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Order Management</h1>
          <p className="text-gray-600">View and manage your recent orders</p>
        </div>
        <button
          onClick={() => setShowTrackModal(true)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Track Order
        </button>
      </div>

      <OrderDataTable orders={orders} onViewDetails={handleViewDetails} />

      {showDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showTrackModal && (
        <TrackOrderModal
          trackingId={trackingId}
          setTrackingId={setTrackingId}
          onTrack={handleTrackOrder}
          onClose={() => setShowTrackModal(false)}
        />
      )}
    </div>
  );
};

export default OrderTablePage;
