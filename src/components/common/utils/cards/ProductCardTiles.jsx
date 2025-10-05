import React, { useContext } from "react";
import plus from "../../../../assets/icons/plus.svg";
import minus from "../../../../assets/icons/minus.svg";
import { CartContext } from "../../../../context/CartContext";
import { formatNumberWithCommas } from "../../../../helper/localPrice/localeprice";
import { BsCurrencyDollar } from "react-icons/bs";

const ProductCard = ({ product, onRemove }) => {
  const { IncrementQuantity, DecrementQuantity } = useContext(CartContext);
  
  const getImage = () => {
    if (product.image_url && product.image_url !== "NULL") return product.image_url;
    if (product.image && product.image !== "NULL")
      return `${import.meta.env.VITE_SERVER_URL}/assets/${product.image}`;
    return "";
  };
  
  return (
    <article className="bg-white p-3 md:p-4 rounded-xl shadow-sm flex items-start gap-3 md:gap-4 w-full">
      <img
        src={getImage()}
        alt={product.name}
        className="w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 object-contain flex-shrink-0"
      />

      <div className="details flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h2 className="text-[#3F66BC] font-medium text-sm md:text-base">
            {product.variation_name}
          </h2>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-[#F8F9FB] rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => DecrementQuantity(product.variationId)}
            >
              <img src={minus} alt="Minus Icon" className="w-4 h-4" />
            </button>
            <span className="bg-[#3F66BC] text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md text-sm md:text-base">
              {product.quantity}
            </span>
            <button
              onClick={() => IncrementQuantity(product.variationId)}
              className="flex justify-center items-center w-8 h-8 md:w-10 md:h-10 bg-[#F8F9FB] rounded-md hover:bg-gray-200 transition-colors"
            >
              <img src={plus} alt="Plus Icon" className="w-4 h-4" />
            </button>
          </div>

          <span className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
            <BsCurrencyDollar className="text-xs md:text-sm mr-0.5" />
            {formatNumberWithCommas((product.offer_price||product.price)*product.quantity)}
          </span>
        </div>

        <p className="text-[#018C01] font-semibold text-base md:text-lg mt-1 md:mt-2">
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2 md:mt-3">
          <div className="flex items-center text-xs md:text-sm text-gray-500 space-x-2 md:space-x-4">
            <span>SKU: {product.sku}</span>
            <span className="relative pl-2 md:pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-px before:h-3 md:before:h-4 before:bg-[#ECF0F9]">
              {product.shippingInfo}
            </span>
          </div>

          <button
            onClick={onRemove}
            className="text-[#3F66BC] hover:underline cursor-pointer text-xs md:text-sm self-start md:self-auto"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;