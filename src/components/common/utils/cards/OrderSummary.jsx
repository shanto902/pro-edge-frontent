import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatNumberWithCommas } from "../../../../helper/localPrice/localeprice";
import { BsCurrencyDollar } from "react-icons/bs";

const OrderSummaryCard = ({ cart }) => {
  const [isCheckoutPage, setIsCheckoutPage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/cart/checkout") {
      setIsCheckoutPage(true);
    }
  }, [location.pathname]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-[#182B55] mb-6">Order Summary</h2>

      <ul className="space-y-3 text-sm text-gray-700">
        <li className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="flex items-center gap-1 font-medium">
            <BsCurrencyDollar className="text-base" />
            {formatNumberWithCommas(cart.subtotal.toFixed(2))}
          </span>
        </li>
        <li className="flex justify-between items-center text-[#5D6576]">
          <span>Shipping</span>
          <span className="flex items-center gap-1">
            <BsCurrencyDollar className="text-base" />
            {formatNumberWithCommas(cart.shipping.toFixed(2))}
          </span>
        </li>
        <li className="flex justify-between items-center">
          <span>Tax</span>
          <span className="flex items-center gap-1 font-medium">
            <BsCurrencyDollar className="text-base" />
            {formatNumberWithCommas(cart.tax.toFixed(2))}
          </span>
        </li>
      </ul>

      <div className="my-6 border-t border-gray-200"></div>

      <div className="flex justify-between items-center text-lg font-semibold text-[#182B55]">
        <span>Total</span>
        <span className="flex items-center gap-1">
          <BsCurrencyDollar className="text-xl" />
          {formatNumberWithCommas(cart.total.toFixed(2))}
        </span>
      </div>

      {!isCheckoutPage && (
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() =>
              navigate("/cart/checkout", { state: { proceedAsGuest: false } })
            }
            className="w-full bg-[#3F66BC] text-white py-2.5 rounded-full text-sm font-medium hover:bg-[#3457a4] transition-colors duration-200"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() =>
              navigate("/cart/checkout", { state: { proceedAsGuest: true } })
            }
            className="w-full border border-[#3F66BC] text-[#3F66BC] py-2.5 rounded-full text-sm font-medium hover:bg-[#3F66BC] hover:text-white transition-colors duration-200"
          >
            Checkout as Guest
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryCard;
