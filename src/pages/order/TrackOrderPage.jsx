import { useState, useEffect } from "react";
import { TruckIcon } from "@heroicons/react/24/outline";
import OrderDetailsModal from "../../components/order/OrderDetails";
import { useOrderContext } from "../../context/OrderContext";
import PageHeader from "../../components/common/utils/banner/SubPageHeader";
import bgImage from "../../assets/images/productDetails/bg.jpeg";
import { Link, useLocation } from "react-router-dom";

const pageContent = {
  "/track-order": {
    title: "Track Your Order",
    description:
      "Enter your order ID to track its current status and location.",
    accountDescription: "View and track items from your order history.",
    guestDescription: "Track your order by entering your order ID number.",
  },
  "/return-order": {
    title: "Return Your Order",
    description:
      "Enter your order ID to initiate a return and follow the return process.",
    accountDescription: "View and return items from your order history.",
    guestDescription:
      "To initiate a return, please enter your order ID Number or contact us at (phone) or by emailing us at (email)",
  },
  "/modify-order": {
    title: "Modify Your Order",
    description:
      "Enter your order ID to modify your order details before it ships.",
    accountDescription: "View and modify items from your order history.",
    guestDescription: "Modify your items using your order number.",
  },
};

const TrackOrderPage = () => {
  const { fetchOrderByEmailAndOrderId } = useOrderContext();
  const [trackingId, setTrackingId] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const initialContent = pageContent[pathname] || {
    title: "Order Support",
    description: "Manage your order here.",
    accountDescription: "Manage items from your order history.",
    guestDescription: "Manage your items using your order number.",
  };

  const [info, setInfo] = useState(initialContent);

  useEffect(() => {
    const content = pageContent[pathname] || {
      title: "Order Support",
      description: "Manage your order here.",
      accountDescription: "Manage items from your order history.",
      guestDescription: "Manage your items using your order number.",
    };
    setInfo(content);
  }, [pathname]);

  const handleTrackOrder = async () => {
    if (!trackingId.trim() || !email.trim()) {
      setError("Please enter both Order ID and Email Address");
      return;
    }

    try {
      const order = await fetchOrderByEmailAndOrderId(email.trim(), trackingId.trim());

      console.log(order, "order");

      if (!order || Object.keys(order).length === 0) {
        setError("Order not found. Please check your order ID and try again.");
        return;
      }

      setSelectedOrder(order);
      setShowDetails(true);
      setTrackingId("");
      setEmail("");
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };


  return (
    <>
      <PageHeader
        title={info.title}
        bgImage={bgImage}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Orders", link: "/order-history" },
          { label: info.title, path: "#" },
        ]}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
          {info.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Account Holders */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-sm">
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TruckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Pro Edge account holders
                  </h2>
                </div>
                <p className="text-gray-600">{info.accountDescription}</p>
              </div>

              <div className="mt-4">
                <Link
                  to={isLoggedIn ? "/profile" : "/auth/signin"}
                  className="w-full block text-center bg-[#182B55] hover:bg-blue-900 text-white font-medium py-3 px-4 rounded-md transition duration-200"
                >
                  {isLoggedIn ? "Go To My Account" : "Login"}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Guest Customers */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-sm">
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TruckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Guest Customers
                  </h2>
                </div>
                <p className="text-gray-600">{info.guestDescription}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="order-number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Order ID Number
                  </label>
                  <input
                    type="text"
                    id="order-number"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Order ID Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#182B55] focus:border-[#182B55]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address (Billing)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#182B55] focus:border-[#182B55]"
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              <div className="mt-auto pt-4">
                <button
                  onClick={handleTrackOrder}
                  className="w-full bg-[#182B55] hover:bg-blue-900 text-white font-medium py-3 px-4 rounded-md transition duration-200"
                >
                  Find Order
                </button>
              </div>
            </div>
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
    </>
  );
};

export default TrackOrderPage;
