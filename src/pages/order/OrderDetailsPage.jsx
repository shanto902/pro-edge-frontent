import React, { useContext, useEffect, useState } from "react";
import OrderDetailsModal from "../../components/order/OrderDetails";
import { useOrderContext } from "../../context/OrderContext";
import { useSearchParams } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { ClipLoader } from "react-spinners";

const OrderDetailsPage = () => {
  const [singleOrderData, setSingleOrderData] = useState(null);
  const [isOrderDetailsPage, setIsOrderDetailsPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const order_id = searchParams.get("order_id");
  const { fetchOrderById } = useOrderContext();

  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    if (!order_id) return;
    setIsOrderDetailsPage(true);

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        clearCart();

        const orderId = order_id;

        const order = await fetchOrderById(orderId);
        setSingleOrderData(order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order_id]);

  if (loading) {
    <div className="fixed inset-0 flex items-center justify-center bg-white z-40">
      <ClipLoader color="#30079f" size={10} />
      <span className="text-blue-600 ml-2">Loading ...</span>
    </div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!singleOrderData) {
    return <div>No order data found</div>;
  }

  return (
    <div>
      <OrderDetailsModal
        isOrderDetailsPage={isOrderDetailsPage}
        order={singleOrderData}
      />
    </div>
  );
};

export default OrderDetailsPage;
