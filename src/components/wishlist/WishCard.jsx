import React from "react";
import { formatNumberWithCommas } from "../../helper/localPrice/localeprice";
import { BsCurrencyDollar } from "react-icons/bs";

const WishCard = ({
  image,
  image_url,
  title,
  priceDollars,
  priceCents,
  inStock,
  sku,
  shippingInfo,
  onAddToCart,
  onRemove,
}) => {
  const getImage = () => {
    if (image_url && image_url !== "NULL") return image_url;
    if (image && image !== "NULL")
      return `${import.meta.env.VITE_SERVER_URL}/assets/${image}`;
    return "";
  };
  console.log(image_url,'wishurl')
  return (
    <article className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-start gap-4">
      <img
        src={getImage()}
        alt={title}
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
      />

      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-[#3F66BC] font-medium text-sm sm:text-base">
            {title}
          </h2>
          <div className="flex flex-wrap gap-4 justify-between md:justify-center items-center">
            <span className="text-lg flex items-center sm:text-xl font-semibold text-gray-800">
              <span className="align-super text-xs sm:text-sm"><BsCurrencyDollar/></span>
              {formatNumberWithCommas(priceDollars)}
              <span className="align-super text-xs sm:text-sm">
                {formatNumberWithCommas(priceCents)}
              </span>
            </span>
            <button
              onClick={onAddToCart}
              className="bg-[#FCD700] text-black px-4 py-2 rounded-full text-sm inline-block whitespace-nowrap hover:bg-orange-700 cursor-pointer"
            >
              Add To Cart
            </button>
          </div>
        </div>

        {inStock && (
          <p className="text-[#018C01] font-semibold text-sm sm:text-base mt-1">
            In Stock
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 space-x-4">
            <span>SKU: {sku}</span>
            <span className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[1px] before:h-4 before:bg-[#ECF0F9]">
              {shippingInfo}
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-[#3F66BC] hover:underline text-sm md:text-lg cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export default WishCard;
