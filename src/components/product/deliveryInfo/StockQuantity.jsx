import React from "react";

const StockQuantity = ({ stockData }) => {
  return (
    <div className="flex flex-col h-16 justify-between">
      <p className={`${stockData.status === "In Stock" ? "text-[#3F66BC]" : "text-red-500"} font-medium text-[16px] leading-6`}>
        {stockData.status}
      </p>
      <div>
        <select
          id="countries"
          className="w-[160px] text-[#182B55] text-[12px] leading-4 border-[1px] border-[#F8F9FB] bg-white"
        >
          {stockData.quantities.map((quantity) => (
            <option key={quantity} value={quantity} className="font-medium">
              Quantity: {quantity}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StockQuantity;
