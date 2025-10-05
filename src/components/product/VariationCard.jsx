import React from "react";
import { formatNumberWithCommas } from "../../helper/localPrice/localeprice";
import { BsCurrencyDollar } from "react-icons/bs";

const VariationCard = ({
  title,
  price,
  originalPrice,
  onClick,
  isSelected,
}) => {
  
  return (
    <div
      className={`w-32 h-24 ${isSelected ? "bg-[#3F66BC]" : "bg-[#F8F9FB]"
        } hover:bg-[#3F66BC] p-3 cursor-pointer shadow-sm rounded-lg border ${isSelected ? "border-[#F8F9FB]" : "border-[#F8F9FB]"
        } hover:border-[#F8F9FB] group transition-all duration-300`}
      onClick={onClick}
    >
      <div
        className={`w-full flex flex-col gap-2 justify-between ${isSelected ? "text-white" : "text-[#182B55]"
          } group-hover:text-white`}
      >
        <h1
          className={`font-semibold text-sm ${isSelected ? "text-white" : "text-[#3F66BC]"
            } group-hover:text-white transition-all duration-300`}
        >
          {title.length > 10 ? title.slice(0, 10) + "..." : title}
        </h1>

        <div
          className={`border-t ${isSelected ? "border-white/25" : "border-[#3F66BC]/10"
            } group-hover:border-white/25 border-dashed`}
        ></div>
        <div className="flex  gap-1 justify-between text-xs font-medium">
          <h1 className="flex items-center group-hover:text-white">  <BsCurrencyDollar/>{formatNumberWithCommas(price)}</h1>
          <h1
            className={`${isSelected ? "text-white" : "text-[#5D6576]"
              } line-through group-hover:text-white`}
          >
            {
              originalPrice<=0 ? "" : formatNumberWithCommas(originalPrice)
            }
          </h1>
        </div>
      </div>
    </div>
  );
};

export default VariationCard;
