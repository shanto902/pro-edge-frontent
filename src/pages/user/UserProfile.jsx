import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderTablePage from "../order/OrdersTable";
import { useOrderContext } from "../../context/OrderContext";
import ProfileSidebar from "./ProfileSidebar";
import ProfileOverview from "./ProfileOverview";
import ReturnOrder from "./ReturnOrder";
import SecuritySettings from "./SecuritySettings";
import TrackOrderUser from "../order/TrackOrderUser";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { orders, updateOrder } = useOrderContext();

  const [trackingId, setTrackingId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);

 

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }
  }, []);

  const handleSaveProfile = () => {
    // API call would go here
    setIsEditing(false);
  };

  const handleCancelOrder = async (order) => {
    
    if(order.order_status === "cancelled"){
      alert("Order is already cancelled");
      return;
    }

    const confirmCancel = confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      await updateOrder(order.id, { order_status: "cancelled" });
      alert("Order has been successfully cancelled.");
    } catch (error) {
      alert("Failed to cancel the order. Please try again." + error);
    }
  };

  const handleReturnOrder = async (order) => {
    if (order.order_status === "on-hold") {
      alert("Order is already Returned");
      return;
    }

    if (order.order_status === "completed") {
      alert("Order is already Completed. You cannot return it.");
      return;
    }

    if (order.order_status === "cancelled") {
      alert("Order is already Cancelled. You cannot return it.");
      return;
    }

    try {
      await updateOrder(order.id, { order_status: "on-hold" });
      alert("Order is now on hold.");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order. Please try again.");
    }
  };

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            handleSignOut={handleSignOut}
          />

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <ProfileOverview
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSaveProfile={handleSaveProfile}
                setUser={setUser}
              />
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Order History</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  <OrderTablePage />
                </div>
              </div>
            )}

            {activeTab === "track-order" && (
              <TrackOrderUser pageInfo={{ title: "Track Order", description: "Track your order by entering your order ID number." }} />
            )}

            {activeTab === "return-order" && (
              <ReturnOrder
                trackingId={trackingId}
                setTrackingId={setTrackingId}
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                orders={orders}
                handleCancelOrder={handleCancelOrder}
                handleReturnOrder={handleReturnOrder}
              />
            )}

            {activeTab === "security" && <SecuritySettings />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;