import React, { useContext } from "react";
import plus from "../../../../assets/icons/plus.svg";
import minus from "../../../../assets/icons/minus.svg";
import { CartContext } from "../../../../context/CartContext";
import { formatNumberWithCommas } from "../../../../helper/localPrice/localeprice";
import { BsCurrencyDollar } from "react-icons/bs";

const ProductCartCheckout = ({ product, onRemove }) => {
  const { IncrementQuantity, DecrementQuantity } = useContext(CartContext);

  const getImage = () => {
    if (product.image_url && product.image_url !== "NULL") return product.image_url;
    if (product.image && product.image !== "NULL")
      return `${import.meta.env.VITE_SERVER_URL}/assets/${product.image}`;
    return "";
  };

  return (
    <article className="bg-white p-2 md:p-3 rounded-lg shadow-sm flex items-start gap-3 w-full">
      <img
        src={getImage()}
        alt={product.name}
        className="w-14 md:w-16 h-14 md:h-16 object-contain flex-shrink-0"
      />

      <div className="details flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h2 className="text-[#3F66BC] font-medium text-sm md:text-sm">
            {product.variation_name}
          </h2>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center w-7 h-7 bg-[#F8F9FB] rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => DecrementQuantity(product.variationId)}
            >
              <img src={minus} alt="Minus Icon" className="w-3 h-3" />
            </button>
            <span className="bg-[#3F66BC] text-white w-7 h-7 flex items-center justify-center rounded-md text-xs">
              {product.quantity}
            </span>
            <button
              onClick={() => IncrementQuantity(product.variationId)}
              className="flex justify-center items-center w-7 h-7 bg-[#F8F9FB] rounded-md hover:bg-gray-200 transition-colors"
            >
              <img src={plus} alt="Plus Icon" className="w-3 h-3" />
            </button>
          </div>

          <span className="text-base font-semibold text-gray-800 flex items-center">
            <BsCurrencyDollar className="text-xs mr-0.5" />
            {formatNumberWithCommas(
              (product.offer_price || product.price) * product.quantity
            )}
          </span>
        </div>

        <p className="text-[#018C01] font-semibold text-sm mt-1">
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mt-2">
          <div className="flex items-center text-xs text-gray-500 space-x-3">
            <span>SKU: {product.sku}</span>
            <span className="relative pl-3 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-px before:h-3 before:bg-[#ECF0F9]">
              {product.shippingInfo}
            </span>
          </div>

          <button
            onClick={onRemove}
            className="text-[#3F66BC] hover:underline cursor-pointer text-xs self-start md:self-auto"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCartCheckout;
