import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Elements,
  PaymentMethodMessagingElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";
import { Helmet } from "react-helmet-async";
import { useProductContext } from "../../context/ProductContext";

// Components
import SubPageHeader from "../../components/common/utils/banner/SubPageHeader";
import ShippingAddress from "../../components/checkout/ShippingAddress";
import BillingAddress from "../../components/checkout/BillingAdress";
import DeliveryMethod from "../../components/checkout/DeliveryMethod";
import OrderSummaryCard from "../../components/common/utils/cards/OrderSummary";
import ProductCardTiles from "../../components/common/utils/cards/ProductCardTiles";
import Button from "../../components/common/utils/button/Button";
import CheckoutSuccess from "./CheckoutSuccess";

// Assets
import bgImage from "../../assets/images/cart.png";
import PaymentSection from "./PayementSection";
import ProductCartCheckout from "../../components/common/utils/cards/ProductCartCheckout";

const Checkout = () => {
  // Context hooks
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, removeFromCart } = useContext(CartContext);
  const { createOrder, updateOrder, createOrderDetails, fetchSettingsGraphQL } =
    useOrderContext();
  const { setSearchTerm } = useProductContext();
  const { register, login } = useAuth();
  const location = useLocation();

  // State
  const [orderID, setOrderID] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingData, setShippingData] = useState(null);
  const [password, setPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [proceedAsGuest, setProceedAsGuest] = useState(false);
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] =
    useState(null);
  const [stripePromise] = useState(() =>
    loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  );
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [hideSameAsShippingText, setHideSameAsShippingText] = useState("");

  // Order data state
  const [orderData, setOrderData] = useState(() =>
    initializeOrderData(user, getCartTotal)
  );

  // Refs
  const hasFetched = useRef(false);
  const paymentRef = useRef();

  // Initialize order data
  function initializeOrderData(user, getCartTotal) {
    const savedOrder = localStorage.getItem("currentOrder");
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const currentUser = user || savedUser;

    const defaultData = {
      name: currentUser
        ? `${currentUser.first_name || ""} ${
            currentUser.last_name || ""
          }`.trim()
        : "",
      company_name: "",
      phone_number: "",
      email: currentUser?.email || "",
      street_address: "",
      address_two: "",
      city: "",
      state: "",
      delivery_method: "standard",
      zip_code: "",
      shipping_charge: 0,
      subtotal: getCartTotal(),
      tax: 0,
      order_status: "pending",
      payment_method: "card",
      payment_status: "unpaid",
      currency: "usd",
      billing_name: currentUser
        ? `${currentUser.first_name || ""} ${
            currentUser.last_name || ""
          }`.trim()
        : "",
      billing_company_name: "",
      billing_phone_number: "",
      billing_email: currentUser?.email || "",
      billing_street_address: "",
      billing_address_two: "",
      billing_city: "",
      billing_state: "",
      billing_zip_code: "",
    };

    return savedOrder
      ? { ...defaultData, ...JSON.parse(savedOrder) }
      : defaultData;
  }
  // Effects
  useEffect(() => {
    if (location.pathname !== "/products") setSearchTerm("");
  }, [location.pathname, setSearchTerm]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    if (location.state?.proceedAsGuest) setProceedAsGuest(true);
  }, [location.state]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchDeliveryData();
    }
  }, []);
  useEffect(() => {
  if (!shippingData || !orderData?.delivery_method) return;

  let shippingCharge = 0;

  if (orderData.delivery_method === "standard") {
    setHideSameAsShippingText("");
    shippingCharge =
      getCartTotal() > 500 ? 0 : parseInt(shippingData.standard_ground_shipping_charge || "0");
  } else if (orderData.delivery_method === "Same Day Shipping") {
    setHideSameAsShippingText(
      "Same-day shipping on orders placed by 3 PM (Eastern Time) for FedEx Ground, Next Day Air, and 2nd Day Air shipments."
    );
    shippingCharge =
      getCartTotal() > 500
        ? 0
        : parseInt(shippingData.same_day_shipping_charge || "0");
  } else {
    // default fallback if method is unknown
    setHideSameAsShippingText("");
    shippingCharge =
      getCartTotal() > 500 ? 0 : parseInt(shippingData.standard_ground_shipping_charge || "0");
  }

  setOrderData((prev) => ({
    ...prev,
    shipping_charge: shippingCharge,
  }));
}, [cartItems, orderData?.delivery_method, shippingData]);


  useEffect(() => {
    updateUserData();
  }, [user]);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const shippingCharge = orderData.shipping_charge;
      const total = calculateTotal(getCartTotal(), shippingCharge);
      const currency = orderData.currency.toLowerCase();
      try {
        const stripeResponse = await createPaymentIntent(total, currency);
        setPaymentIntentClientSecret(stripeResponse.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    fetchPaymentIntent();
  }, [cartItems]);

  useEffect(() => {
    if (
      cartItems.length === 0 &&
      location.pathname !== "/products" &&
      !loading
    ) {
      navigate("/products");
    }
  }, [cartItems, navigate, location.pathname, loading]);

  // Data fetching
  const fetchDeliveryData = async () => {
    try {
      const data = await fetchSettingsGraphQL();
      setShippingData(data);
    } catch (error) {
      console.error("Error fetching delivery location data:", error);
    }
  };

  // User data handling
  const updateUserData = () => {
    const currentUser = user || JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      setOrderData((prev) => ({
        ...prev,
        name: `${currentUser.first_name || ""} ${
          currentUser.last_name || ""
        }`.trim(),
        email: currentUser.email || prev.email,
        billing_name: `${currentUser.first_name || ""} ${
          currentUser.last_name || ""
        }`.trim(),
        billing_email: currentUser.email || prev.billing_email,
      }));
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setOrderData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Sync billing if sameAsShipping is enabled
      if (sameAsShipping) {
        const shippingToBillingMap = {
          name: "billing_name",
          company_name: "billing_company_name",
          phone_number: "billing_phone_number",
          email: "billing_email",
          street_address: "billing_street_address",
          address_two: "billing_address_two",
          city: "billing_city",
          state: "billing_state",
          zip_code: "billing_zip_code",
        };

        const billingField = shippingToBillingMap[name];
        if (billingField) {
          updated[billingField] = value;
        }
      }

      return updated;
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSameAsShippingChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsShipping(isChecked);

    if (isChecked) {
      setOrderData((prev) => ({
        ...prev,
        billing_name: prev.name,
        billing_company_name: prev.company_name,
        billing_phone_number: prev.phone_number,
        billing_email: prev.email,
        billing_street_address: prev.street_address,
        billing_address_two: prev.address_two,
        billing_city: prev.city,
        billing_state: prev.state,
        billing_zip_code: prev.zip_code,
      }));

      // Clear billing errors when same as shipping is checked
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.billing_name;
        delete newErrors.billing_phone_number;
        delete newErrors.billing_email;
        delete newErrors.billing_street_address;
        delete newErrors.billing_city;
        delete newErrors.billing_state;
        delete newErrors.billing_zip_code;
        return newErrors;
      });
    }
  };

  const handleClearAddress = () => {
    setOrderData((prev) => ({
      ...prev,
      billing_name: "",
      billing_company_name: "",
      billing_phone_number: "",
      billing_email: "",
      billing_street_address: "",
      billing_address_two: "",
      billing_city: "",
      billing_state: "",
      billing_zip_code: "",
    }));
  };

 const handleDeliveryMethodChange = (method) => {
  let shippingCharge = 0;

  if (method === "standard") {
    shippingCharge = getCartTotal() > 500
      ? 0
      : parseInt(shippingData?.standard_ground_shipping_charge || 0);
    setHideSameAsShippingText(""); 
  } else if (method === "Same Day Shipping") {
    shippingCharge = getCartTotal() > 500
      ? 0
      : parseInt(shippingData?.same_day_shipping_charge || 0);
    setHideSameAsShippingText(
      "Same-day shipping on orders placed by 3 PM (Eastern Time) for FedEx Ground, Next Day Air, and 2nd Day Air shipments."
    ); // Always show message if same-day selected
  }

  const updatedOrderData = {
    ...orderData,
    delivery_method: method,
    shipping_charge: shippingCharge,
  };

  setOrderData(updatedOrderData);
  localStorage.setItem("currentOrder", JSON.stringify(updatedOrderData));
};


  // Validation
  const validateForm = () => {
    const requiredFields = {
      name: orderData.name,
      phone_number: orderData.phone_number,
      email: orderData.email,
      street_address: orderData.street_address,
      city: orderData.city,
      state: orderData.state,
      zip_code: orderData.zip_code,
      billing_name: orderData.billing_name,
      billing_phone_number: orderData.billing_phone_number,
      billing_email: orderData.billing_email,
      billing_street_address: orderData.billing_street_address,
      billing_city: orderData.billing_city,
      billing_state: orderData.billing_state,
      billing_zip_code: orderData.billing_zip_code,
    };

    const errors = {};
    let isValid = true;

    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value) {
        errors[field] = "This field is required";
        isValid = false;
      }
    });

    if (
      orderData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email)
    ) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (
      orderData.billing_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.billing_email)
    ) {
      errors.billing_email = "Please enter a valid billing email address";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  // Registration
  const handleRegister = async () => {
    if (!password || !orderData.email) {
      setRegisterMessage("Email and Password are required");
      return;
    }

    try {
      await register({
        email: orderData.email,
        password,
      });
      await login(orderData.email, password);
      setRegisterMessage("Registered successfully!");
    } catch (err) {
      console.error("Registration error:", err);
      setRegisterMessage(
        err?.response?.data?.message || err?.message || "Registration failed"
      );
    }
  };
  // make payment
  const handleMakePayment = async () => {
    const result = await paymentRef.current?.submitPayment();
    console.log(result, "stripe result");
    return result;
  };
  // Order placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. First handle user registration if needed
      if (!proceedAsGuest && !isAuthenticated) {
        await handleRegister();
      }

      // 2. Process payment FIRST
      const paymentResult = await handleMakePayment();
      console.log(paymentResult, "res");
      if (!paymentResult?.success) {
        throw new Error(paymentResult?.message || "Payment failed");
      }

      // 3. Only create order AFTER successful payment
      const finalOrderData = {
        ...orderData,
        subtotal:
          getCartTotal() +
          (getCartTotal() > 500 ? 0 : parseInt(orderData.shipping_charge)) +
          orderData.tax,
        payment_status: "paid",
        // payment_intent_id: paymentResult.paymentIntent.id,
      };

      const response = await createOrder(finalOrderData);
      const orderId = generateOrderId(user, response.id);

      // 4. Update order with generated ID
      const resUpdateOrder = await updateOrder(response.id, {
        order_id: orderId,
        customer_id: user?.id || null,
        payment_status: "paid",
      });
      if (resUpdateOrder) {
        setOrderID(resUpdateOrder.order_id);
      }
      localStorage.setItem("currentOrder", JSON.stringify(finalOrderData));

      // 5. Create order details
      for (const item of cartItems) {
        await createOrderDetails({
          order_id: { id: response.id },
          variation_id: parseInt(item.variationId),
          product_title: item.title,
          user_email: orderData.email,
          total_price: String(item.price * item.quantity),
          quantity: parseInt(item.quantity),
        });
      }

      navigate(`/order-details?order_id=${orderId}`, {
        state: {
          paymentIntentId: paymentResult.paymentIntent.id,
          amount: paymentResult.paymentIntent.amount / 100,
        },
      });
    } catch (err) {
      console.error("Order submission error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to place order. Please try again."
      );
      // Consider adding order cleanup here if payment succeeded but order creation failed
    } finally {
      setLoading(false);
    }
  };

  const generateOrderId = (user, orderId) => {
    const guestId = user?.id || generateGuestId();
    return `${guestId?.toString().substring(0, 6)}-${orderId}`;
  };

  const generateGuestId = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const array = new Uint8Array(7);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => chars[byte % chars.length]).join("");
  };

  const calculateTotal = (cartTotal, shippingCharge) => {
    return cartTotal + (cartTotal > 500 ? 0 : parseInt(shippingCharge));
  };

  const createPaymentIntent = async (total, currency) => {
    return await axios.post(
      `${
        import.meta.env.VITE_SERVER_URL
      }/stripe-payments/create-payment-intent`,
      {
        amount: Math.round(total * 100),
        currency: currency,
      }
    );
  };

  //  payment success handler
  const handlePaymentSuccess = (paymentIntent) => {
    console.log("Payment succeeded:", paymentIntent);
    setPaymentCompleted(true);
    // No additional logic needed here since we handle everything in handlePlaceOrder
  };

  const handlePaymentError = (error) => {
    setError(error.message);
  };

  // Order summary
  const orderSummary = {
    subtotal: getCartTotal(),
    shipping: orderData.shipping_charge,
    tax: orderData.tax,
    total: getCartTotal() + orderData.shipping_charge,
    discount: 0,
    type: "checkout",
  };

  if (paymentCompleted) {
    return <CheckoutSuccess navigate={navigate} />;
  }

  return (
    <div className="bg-[#F8F9FB]">
      <Helmet>
        <title>ProEdge</title>
        <meta
          name="description"
          content="Welcome to ProEdge. Discover our products and services."
        />
      </Helmet>

      {/* <SubPageHeader
        title="Checkout"
        currentPage="checkout"
        bgImage={bgImage}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Cart", link: "/cart" },
          { label: "Checkout" },
        ]}
      /> */}

      <section className="mt-10 max-w-7xl w-full mx-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10">
        <form className="col-span-2 space-y-8" onSubmit={handlePlaceOrder}>
          
          <ShippingAddress
            values={mapOrderDataToShipping(orderData)}
            onChange={handleShippingChange(handleInputChange)}
            errors={mapFieldErrors(fieldErrors)}
          />
          {!isAuthenticated && !proceedAsGuest && (
            <RegistrationSection
              password={password}
              setPassword={setPassword}
              registerMessage={registerMessage}
            />
          )}
          <DeliveryMethod
            selectedMethod={orderData.delivery_method}
            getCartTotal={getCartTotal()}
            shippingData={shippingData}
            onChange={handleDeliveryMethodChange}
          />
          {hideSameAsShippingText && (
            <p className="text-indigo-400 text-xm sm:text-base md:text-lg lg:text-xl">
              {hideSameAsShippingText}
            </p>
          )}

          <BillingAddress
            values={mapOrderDataToBilling(orderData)}
            onChange={handleBillingChange(handleInputChange)}
            errors={mapBillingFieldErrors(fieldErrors)}
            onClear={handleClearAddress}
            sameAsShipping={sameAsShipping}
            onSameAsShippingChange={handleSameAsShippingChange}
          />
          {paymentIntentClientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: paymentIntentClientSecret,
                wallets: {
                  applePay: "auto",
                  googlePay: "auto",
                },
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#3F66BC",
                  },
                },
                loader: "auto",
                fonts: [
                  {
                    cssSrc: "https://fonts.googleapis.com/css?family=Inter",
                  },
                ],
              }}
            >
              <PaymentSection
                orderSummary={orderSummary}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                email={orderData.email}
                ref={paymentRef}
              />
            </Elements>
          )}
          
          <OrderSubmissionSection
            loading={loading}
            error={error}
            handlePlaceOrder={handlePlaceOrder}
          />

        </form>
        <div className="flex flex-col gap-y-6"> 
<CartSection
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            navigate={navigate}
          />
        <OrderSummarySection orderSummary={orderSummary} />
        </div>

      </section>
    </div>
  );
};

// Helper functions for mapping data
const mapOrderDataToShipping = (orderData) => ({
  fullname: orderData.name,
  companyname: orderData.company_name,
  phone: orderData.phone_number,
  email: orderData.email,
  streetaddress: orderData.street_address,
  address2: orderData.address_two,
  city: orderData.city,
  state: orderData.state,
  zip: orderData.zip_code,
});

const mapOrderDataToBilling = (orderData) => ({
  billingFullname: orderData.billing_name,
  billingCompany: orderData.billing_company_name,
  billingPhone: orderData.billing_phone_number,
  billingEmail: orderData.billing_email,
  billingStreet: orderData.billing_street_address,
  billingAddress2: orderData.billing_address_two,
  billingCity: orderData.billing_city,
  billingState: orderData.billing_state,
  billingZip: orderData.billing_zip_code,
});

const mapFieldErrors = (fieldErrors) => ({
  fullname: fieldErrors.name || fieldErrors.fullname,
  phone: fieldErrors.phone_number || fieldErrors.phone,
  email: fieldErrors.email,
  streetaddress: fieldErrors.street_address || fieldErrors.streetaddress,
  city: fieldErrors.city,
  state: fieldErrors.state,
  zip: fieldErrors.zip_code || fieldErrors.zip,
});
const mapBillingFieldErrors = (fieldErrors) => ({
  billingFullname: fieldErrors.billing_name,
  billingPhone: fieldErrors.billing_phone_number,
  billingEmail: fieldErrors.billing_email,
  billingStreet: fieldErrors.billing_street_address,
  billingCity: fieldErrors.billing_city,
  billingState: fieldErrors.billing_state,
  billingZip: fieldErrors.billing_zip_code,

  // Add these to ensure all possible error keys are mapped
  billing_name: fieldErrors.billing_name,
  billing_phone_number: fieldErrors.billing_phone_number,
  billing_email: fieldErrors.billing_email,
  billing_street_address: fieldErrors.billing_street_address,
  billing_city: fieldErrors.billing_city,
  billing_state: fieldErrors.billing_state,
  billing_zip_code: fieldErrors.billing_zip_code,
});

const handleShippingChange = (handleInputChange) => (e) => {
  const { name, value } = e.target;
  const orderField = {
    fullname: "name",
    companyname: "company_name",
    phone: "phone_number",
    email: "email",
    streetaddress: "street_address",
    address2: "address_two",
    city: "city",
    state: "state",
    zip: "zip_code",
  }[name];
  handleInputChange({ target: { name: orderField, value } });
};

const handleBillingChange = (handleInputChange) => (e) => {
  const { name, value } = e.target;
  const orderField = {
    billingFullname: "billing_name",
    billingCompany: "billing_company_name",
    billingPhone: "billing_phone_number",
    billingEmail: "billing_email",
    billingStreet: "billing_street_address",
    billingAddress2: "billing_address_two",
    billingCity: "billing_city",
    billingState: "billing_state",
    billingZip: "billing_zip_code",
  }[name];
  handleInputChange({ target: { name: orderField, value } });
};

// Sub-components
const CartSection = ({ cartItems, removeFromCart, navigate }) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl md:text-3xl font-semibold text-[#182B55]">
         Cart ({cartItems.length} Items)
      </h1>
      <button
        type="button"
        className="ml-auto px-4 py-2 rounded-full bg-white border-2 border-[#ECF0F9] text-sm text-[#3F66BC] hover:cursor-pointer"
        onClick={() => navigate("/cart")}
      >
        Edit Cart
      </button>
    </div>

    <div className="flex flex-col gap-4 my-8">
      {cartItems.map((product) => (
        <ProductCartCheckout
          key={product.variationId}
          product={product}
          onRemove={() => removeFromCart(product)}
        />
      ))}
    </div>
  </>
);

const RegistrationSection = ({ password, setPassword, registerMessage }) => {
  return (
    <div className="flex-1 w-full md:w-2/3">
      <label
        htmlFor="password"
        className="block text-[#182B55] text-sm font-medium mb-1"
      >
       Create Your Account Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
        className="w-full p-3 rounded-lg border border-gray-300 bg-[#F8F9FB] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        required
      />
      {registerMessage && (
        <p className="text-red-600 text-sm mt-1">{registerMessage}</p>
      )}
    </div>
  );
};

const OrderSubmissionSection = ({ loading, error, handlePlaceOrder }) => (
  <section className="my-10">
    <Button
      label={loading ? "Processing..." : "Place Order"}
      disabled={loading}
      onClick={handlePlaceOrder}
    />

    {error && <div className="text-red-600 text-center mt-3">{error}</div>}

    <p className="text-sm max-w-md w-full mx-auto text-[#182B55] text-center mt-3">
      By clicking Place Order you agree to Pro Edge's
      <Link to="/terms-of-use" className="text-[#3F66BC] underline">
        {" "}
        Terms & Conditions
      </Link>
      and{" "}
      <Link to="/payment-policy" className="text-[#3F66BC] underline">
        Privacy Policy
      </Link>
      .
    </p>
  </section>
);

const OrderSummarySection = ({ orderSummary }) => (
  <div className="p-6 rounded-lg h-fit">
    
    <OrderSummaryCard cart={orderSummary} />
  </div>
);

export default Checkout;
