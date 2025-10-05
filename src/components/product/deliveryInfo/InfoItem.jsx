import React from "react";

const InfoItem = ({ label, value }) => {
  return (
    <div className="flex gap-2">
      <p className="whitespace-nowrap w-[70px]">{label}</p>
      <p className="text-[#3F66BC] font-medium text-left w-[100px]">
        {value}
      </p>
    </div>
  );
};

export default InfoItem;
