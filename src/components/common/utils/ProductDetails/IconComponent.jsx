import React from "react";

const IconComponent = ({ icon }) => {
  return (
    <div className="w-[80px] h-[80px] bg-[#F8F9FB] rounded-full flex items-center justify-center">
      {icon}
    </div>
  );
};

export default IconComponent;
