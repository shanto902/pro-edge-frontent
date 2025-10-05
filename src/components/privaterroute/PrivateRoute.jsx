// components/PrivateRoute.jsx
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(null); // null for initial state

  useEffect(() => {
    const validateAuth = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("access_token");

      // Case 1: No user or token
      if (!storedUser || !token) {
        setIsValid(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Case 2: Token expired
        if (decoded.exp < currentTime) {
          console.warn("Token has expired!");
          showSessionExpiredToast();
          setIsValid(false);
          return;
        }

        // Case 3: Valid token
        // console.log("Token is valid until", new Date(decoded.exp * 1000));
        setIsValid(true);
      } catch (err) {
        console.error("Invalid token:", err.message);
        setIsValid(false);
      }
    };

    validateAuth();
  }, []);

  const showSessionExpiredToast = () => {
    toast.dismiss();
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p>Your session has expired</p>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() => { closeToast(); navigate("/"); }}
            >
              Home
            </button>
            <button 
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => { closeToast(); navigate("/auth/signin"); }}
            >
              Login
            </button>
          </div>
        </div>
      ),
      { 
        autoClose: false,
        closeButton: false
      }
    );
  };

  // Loading state
  if (isValid === null) {
    return null; // or a loading spinner
  }

  // Redirect if not valid
  if (!isValid) {
    return <Navigate to="/auth/signin" replace />;
  }

  // Render protected routes
  return <Outlet />;
};

export default PrivateRoute;