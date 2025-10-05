import { useState } from "react";
import axios from "axios";

const SecuritySettings = () => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = JSON.parse(localStorage.getItem("user"))?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/password/request`, {
        email,
        reset_url: `${import.meta.env.VITE_CLIENT_URL}/auth/reset-password`,
      });

      setMessage("✅ Reset email sent! Please check your inbox.");
    } catch (error) {
      const msg =
        error.response?.data?.errors?.[0]?.message || "Failed to send reset email.";
      setMessage("❌ " + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Security Settings</h2>
      </div>
      <div className="p-6">
        <p className="mb-4 text-sm text-gray-600">
          Click the button below to receive a password reset link via email.
        </p>
        {message && (
          <div className="mb-4 text-sm">
            {message}
          </div>
        )}
        <button
          type="button"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
        >
          {isSubmitting ? "Sending..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
