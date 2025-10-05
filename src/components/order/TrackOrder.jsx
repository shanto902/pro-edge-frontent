import { TruckIcon } from "@heroicons/react/24/outline";

const TrackOrderModal = ({ trackingId, setTrackingId, onTrack, onClose }) => (
  <div className="fixed z-50 inset-0 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <div className="absolute inset-0 bg-gray-800 opacity-75 z-[-1]"></div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
        &#8203;
      </span>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <TruckIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Track Your Order</h3>
            <p className="text-sm text-gray-500 mt-2">
              Track your order by entering your order ID number.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="Please check your order confirmation email to find your order ID number."
          />
          <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
              onClick={onTrack} 
            >
              Track
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TrackOrderModal;
