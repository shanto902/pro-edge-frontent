import React from "react";

const Button = ({ text, bgColor, textColor, hoverColor }) => {
  return (
    <button
      className={`py-1 px-6 cursor-pointer ${bgColor} rounded-[60px] w-full font-medium text-[12px] leading-6 ${textColor} ${hoverColor}`}
    >
      {text}
    </button>
  );
};

export default Button;
