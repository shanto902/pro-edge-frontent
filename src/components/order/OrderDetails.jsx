import {
  CheckBadgeIcon,
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  PrinterIcon,
  NoSymbolIcon,
  XMarkIcon,
  ClockIcon,
  ArrowPathIcon,
  PauseCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { useOrderContext } from "../../context/OrderContext";
import jsPDF from "jspdf";
import { useEffect, useRef } from "react";
import { BiCopy, BiDownload } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { GiConsoleController } from "react-icons/gi";

const OrderDetailsModal = ({ isOrderDetailsPage, order, onClose }) => {
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        icon: ClockIcon,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
      },
      failed: {
        icon: XCircleIcon,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      },
      processing: {
        icon: ArrowPathIcon,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      },
      "on-hold": {
        icon: PauseCircleIcon,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
      },
      completed: {
        icon: CheckCircleIcon,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      },
      cancelled: {
        icon: NoSymbolIcon,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      },
      refunded: {
        icon: ArrowUturnLeftIcon,
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
      },
      default: {
        icon: ArrowPathIcon,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
      },
    };

    const {
      icon: Icon,
      bgColor,
      textColor,
    } = statusConfig[status.toLowerCase()] || statusConfig.default;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </span>
    );
  };
  // console.log(console.log(order, "order"));

  const currentPath = location.pathname;

  const { updateOrder } = useOrderContext();

  const handleJob = async () => {
    if (!order) {
      alert("Order not found.");
      return;
    }

    try {
      switch (currentPath) {
        case "/return-order":
          if (order.order_status === "on-hold") {
            alert("This order has already been marked as returned.");
            return;
          }

          if (order.order_status === "completed") {
            alert("Completed orders cannot be returned.");
            return;
          }

          if (order.order_status === "cancelled") {
            alert("Order is already cancelled. Can't Return");
            return;
          }

          await updateOrder(order.id, { order_status: "on-hold" });
          alert("Order marked as returned and is now on hold.");
          break;

        case "/modify-order":
          const userConfirmed = confirm(
            "Are you sure you want to cancel this order?"
          );
          if (!userConfirmed) return;

          if (order.order_status === "cancelled") {
            alert("Order is already cancelled.");
            return;
          }

          await updateOrder(order.id, { order_status: "cancelled" });
          alert("Order has been successfully cancelled.");
          break;

        default:
          console.warn("Unhandled path:", currentPath);
          alert("This operation is not supported.");
      }
    } catch (error) {
      console.error("Order update error:", error);
      alert("Something went wrong while updating the order. Please try again.");
    }
  };

  const printRef = useRef(null);
  if (!order) return null;

  const totalAmount =
    (order.subtotal || 0) +
    (order.tax || 0) +
    (order.shipping_charge || order.shippingCharge || 0);

  // Extract billing fields
  const billing = {
    name: order.billing_name || order.name,
    company: order.billing_company_name || order.company_name,
    email: order.billing_email || order.email,
    phone: order.billing_phone_number || order.phone_number,
    address: order.billing_street_address
      ? `${order.billing_street_address}, ${
          order.billing_city || order.city
        }, ${order.billing_state || order.state} - ${
          order.billing_zip_code || order.zip_code
        }`
      : order.street_address
      ? `${order.street_address}, ${order.city}, ${order.state} - ${order.zip_code}`
      : "N/A",
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    // Color scheme from your Tailwind design
    const bgColor = "#f9fafb"; // bg-gray-50
    const textColor = "#111827"; // text-gray-900
    const mutedTextColor = "#4b5563"; // text-gray-600
    const borderColor = "#e5e7eb"; // border-gray-200
    const primaryColor = "#374151"; // Matching your modal's heading color

    // Page setup
    const margin = 15;
    let yPos = margin;

    // Header with border
    doc.setFontSize(20);
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "bold");
    doc.text(`Order Details - ${order.order_id}`, margin, yPos);
    doc.text(` ${order.payment_status}`, margin, yPos + 10);

    // Add divider line
    doc.setDrawColor(borderColor);
    doc.line(margin, yPos + 15, 200 - margin, yPos + 15);

    yPos += 25;

    // Two-column layout
    const colWidth = 85;

    // Customer Information
    doc.setFillColor(bgColor);
    doc.rect(margin, yPos, colWidth, 60, "F");
    doc.rect(margin, yPos, colWidth, 60, "S"); // border

    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text("Customer Information", margin + 5, yPos + 10);

    doc.setFontSize(10);
    doc.setTextColor(mutedTextColor);
    let textY = yPos + 18;

    const customerDetails = [
      { label: "Company:", value: order.company_name || "N/A" },
      { label: "Email:", value: order.email || "N/A" },
      { label: "Phone:", value: order.phone_number || "N/A" },
      { label: "Address:", value: order.street_address || "N/A" },
      { value: `${order.city}, ${order.state} - ${order.zip_code}` },
    ];

    customerDetails.forEach((detail) => {
      if (detail.label) {
        doc.text(`${detail.label} ${detail.value}`, margin + 5, textY);
      } else {
        doc.text(detail.value, margin + 5, textY);
      }
      textY += 7;
    });

    // Billing Information
    const billingX = margin + colWidth + 10;
    doc.setFillColor(bgColor);
    doc.rect(billingX, yPos, colWidth, 60, "F");
    doc.rect(billingX, yPos, colWidth, 60, "S"); // border

    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text("Billing Information", billingX + 5, yPos + 10);

    doc.setFontSize(10);
    doc.setTextColor(mutedTextColor);
    textY = yPos + 18;

    const billingDetails = [
      { label: "Name:", value: billing.name || "N/A" },
      ...(billing.company
        ? [{ label: "Company:", value: billing.company }]
        : []),
      { label: "Email:", value: billing.email || "N/A" },
      { label: "Phone:", value: billing.phone || "N/A" },
      { label: "Address:", value: billing.address || "N/A" },
    ];

    billingDetails.forEach((detail) => {
      doc.text(`${detail.label} ${detail.value}`, billingX + 5, textY);
      textY += 7;
    });

    yPos += 70;

    // Order Summary (full width)
    doc.setFillColor(bgColor);
    doc.rect(margin, yPos, 180, 45, "F");
    doc.rect(margin, yPos, 180, 45, "S"); // border

    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text("Order Summary", margin + 5, yPos + 10);

    // Payment Details (left column)
    doc.setFontSize(10);
    doc.setTextColor(mutedTextColor);
    textY = yPos + 18;

    const paymentDetails = [
      { label: "Payment Method:", value: order.payment_method || "N/A" },
      { label: "Delivery Method:", value: order.delivery_method || "N/A" },
      {
        label: "Order Date:",
        value: new Date(order.created_at || order.date).toLocaleDateString(),
      },
    ];

    paymentDetails.forEach((detail) => {
      doc.text(`${detail.label} ${detail.value}`, margin + 5, textY);
      textY += 7;
    });

    // Amount Details (right column)
    const amountX = margin + 100;
    textY = yPos + 18;

    const amountDetails = [
      { label: "Subtotal:", value: order.subtotal?.toFixed(2) || "0.00" },
      {
        label: "Shipping:",
        value: order.shipping_charge?.toFixed(2) || "0.00",
      },
      { label: "Tax:", value: order.tax?.toFixed(2) || "0.00" },
    ];

    amountDetails.forEach((detail) => {
      doc.text(detail.label, amountX, textY);
      doc.text(`$${detail.value}`, 200 - margin - 5, textY, { align: "right" });
      textY += 7;
    });

    // Total amount
    doc.setFont("helvetica", "bold");
    doc.setTextColor(textColor);
    doc.text("Total:", amountX, yPos + 39);
    doc.text(`$${totalAmount.toFixed(2)}`, 200 - margin - 5, yPos + 39, {
      align: "right",
    });

    // Add total divider line
    doc.setDrawColor(borderColor);
    doc.line(amountX, yPos + 35, 200 - margin, yPos + 35);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(mutedTextColor);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    doc.text(
      "If you have any questions, please contact our support team.",
      105,
      285,
      { align: "center" }
    );

    doc.save(`Invoice_Order_${order.id}.pdf`);
  };

  return (
    <div
      className={`z-50 inset-0 overflow-y-auto  bg-opacity-50 ${
        isOrderDetailsPage ? "w-full h-screen" : "fixed bg-black/60"
      }`}
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex justify-between items-center flex-wrap gap-y-4 border-b pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order Details -
                    <span
                      className="cursor-pointer text-blue-500 hover:underline flex gap-x-2"
                      title="Click to copy Order ID"
                    >
                      {order.order_id}
                      <BiCopy
                        onClick={() => {
                          alert("Order ID copied to clipboard");
                          navigator.clipboard.writeText(order.order_id);
                        }}
                      />
                    </span>
                    <p
                      className={`px-5 py-1 mt-2 rounded-md  text-center font-bold  ${
                        order.payment_status === "paid"
                          ? "bg-green-500 text-blue-950"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                    </p>
                  </h3>
                  <div className="flex justify-between items-center gap-2">
                    {(currentPath == "/return-order" ||
                      currentPath == "/modify-order") && (
                      <button
                        className={`px-4 py-1 ${
                          currentPath == "/return-order"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        } text-white rounded-2xl`}
                        onClick={handleJob}
                      >
                        {currentPath == "/return-order"
                          ? "Return Order"
                          : "Cancel Order"}
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div
                  ref={printRef}
                  className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {order.company_name || "N/A"}
                      </p>
                      <p className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {order.email || "N/A"}
                      </p>
                      <p className="flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {order.phone_number || "N/A"}
                      </p>
                      <p className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {order.street_address
                          ? `${order.street_address}, ${order.city}, ${order.state} - ${order.zip_code}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Billing Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <CreditCardIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Billing Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {billing.name || "N/A"}
                      </p>
                      {billing.company && (
                        <p className="flex items-center">
                          <BuildingOfficeIcon className="w-4 h-4 mr-2 text-gray-500" />
                          {billing.company}
                        </p>
                      )}
                      <p className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {billing.email || "N/A"}
                      </p>
                      <p className="flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {billing.phone || "N/A"}
                      </p>
                      <p className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {billing.address}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3">
                      Order Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Payment Details</h5>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between">
                            <span className="text-gray-600">
                              Payment Method:
                            </span>
                            <span className="font-medium">
                              {order.payment_method || "N/A"}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-600">
                              Delivery Method:
                            </span>
                            <span className="font-medium">
                              {order.delivery_method || "N/A"}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-600">Order Date:</span>
                            <span className="font-medium">
                              {new Date(
                                order.created_at || order.date
                              ).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-600">Order Status:</span>
                            <span className="font-medium">
                              <StatusBadge status={order.order_status} />
                            </span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Amount Details</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">
                              ${order.subtotal?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-medium">
                              ${order.shipping_charge?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span className="font-medium">
                              ${order.tax?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-blue-600 mt-2 pt-2 border-t border-gray-200">
                            <span>Total:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <BiDownload className="h-5 w-5 mr-2" />
              Donwload Invoice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
