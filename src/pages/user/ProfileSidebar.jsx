import { FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfileSidebar = ({ activeTab, setActiveTab, user, handleSignOut }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col gap-3 items-start ml-3 space-x-4 mb-6">
          <div>
            <h2 className="font-semibold text-lg">
              {user.first_name + " " + user.last_name}
            </h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Profile Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "orders"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab("track-order")}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "track-order"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Track Order
          </button>
          <button
            onClick={() => setActiveTab("return-order")}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "return-order"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Return Order
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "security"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Change Password
          </button>
          <button
            onClick={handleSignOut}
            className={`w-full text-left px-4 py-2 rounded-md bg-white hover:bg-red-600 text-gray-900 hover:text-gray-50 transition-all duration-300 ease-in-out`}
          >
            Sign Out
          </button>
        </nav>
      </div>

      <button
        onClick={() => navigate("/products")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm flex items-center justify-center space-x-2"
      >
        <FiShoppingBag className="w-5 h-5" />
        <span>Place New Order</span>
      </button>
    </div>
  );
};

export default ProfileSidebar;
