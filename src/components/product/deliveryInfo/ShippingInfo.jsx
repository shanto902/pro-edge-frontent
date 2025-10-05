import React from "react";

const ShippingInfo = ({ shippingInfo }) => {
  return (
    <div className="text-[12px] leading-[18px] flex flex-col space-y-2">
      <p className="text-[#182B55] font-medium">
        <span className="text-[#4A5A7E]">{shippingInfo.title}</span>
        {shippingInfo.description}
      </p>
    </div>
  );
};

export default ShippingInfo;