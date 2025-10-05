// src/pages/checkout/CheckoutSuccess.jsx
import { Link, useNavigate } from "react-router-dom";

const CheckoutSuccess = ({ navigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Payment Successful!
        </h2>
        <p className="mt-2 text-gray-600">
          Your order has been placed successfully. You'll receive a confirmation email shortly.
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Continue Shopping
          </button>
          <Link
            to="/orders"
            className="inline-block w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            View Your Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;