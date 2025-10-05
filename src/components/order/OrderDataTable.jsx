import { CheckBadgeIcon, ClockIcon, XCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";
import { useOrderContext } from "../../context/OrderContext";
import { EyeIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, PauseCircleIcon, NoSymbolIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
// import StatusBadge from "./StatusBadge";

const OrderDataTable = ({ onViewDetails }) => {
  const { orders, loading } = useOrderContext();
  // console.log(loading,'loading');
  // console.log(orders,'orders');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
  
    const { icon: Icon, bgColor, textColor } = statusConfig[status.toLowerCase()] || statusConfig.default;
  
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </span>
    );
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(order => 
      Object.values(order).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [orders, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredOrders, currentPage, ordersPerPage]);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <input
          type="text"
          placeholder="Search orders..."
          className="block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {['Order ID', 'Date', 'Customer', 'Status', 'Amount', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.order_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.date_created)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <StatusBadge status={order.order_status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(order.subtotal + order.tax + order.shipping_charge)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredOrders.length}
        itemsPerPage={ordersPerPage}
      />
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === page 
                  ? 'bg-blue-50 border-blue-500 text-blue-600' 
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default OrderDataTable;