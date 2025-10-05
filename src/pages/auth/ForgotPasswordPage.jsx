// src/pages/auth/ResetPass.jsx
import React, { useState } from "react";
import BackButton from "../../components/common/utils/button/BackButton";
import TextInput from "../../components/common/form/TextInput";
import Button from "../../components/common/utils/button/Button";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

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
      setLoading(false);
    }
  };

  return (
    <main className="flex items-start justify-center min-h-screen">
      <article className="bg-white p-8 max-w-xl w-full rounded-xl">
        <header className="mb-8">
          <BackButton to="/auth/signin" />
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#182B55]">Forgot Password?</h1>
            <p className="text-[#5D6576]">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`text-sm font-semibold text-center ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <TextInput
              type="email"
              id="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button label={loading ? "Sending..." : "Send Email"} disabled={loading} />
          </form>
        </div>
      </article>
    </main>
  );
};

export default ForgotPasswordPage;
