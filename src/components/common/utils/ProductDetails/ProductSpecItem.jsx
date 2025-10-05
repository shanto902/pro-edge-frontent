import React from "react";

const ProductSpecItem = ({ label, value }) => {
  return (
    <div className="flex gap-2">
      <p className="whitespace-nowrap w-[180px] text-[16px] font-semibold">{label}</p>
      <p className="text-[#4A5A7E] text-left w-[100px] text-[16px]">{value}</p>
    </div>
  );
};

export default ProductSpecItem;
