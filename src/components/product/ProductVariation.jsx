import { Link, useNavigate } from "react-router-dom";
import VariationCard from "./VariationCard";
import { RiArrowDropDownLine } from "react-icons/ri";
import { formatNumberWithCommas } from "../../helper/localPrice/localeprice";
import { BsCurrencyDollar } from "react-icons/bs";

const ProductVariation = ({
  title,
  sku,
  rating,
  totalRatings,
  currentPrice,
  originalPrice,
  variationName,
  variationValue,
  priceOptions = [],
  onVariationChange,
  selectedVariationId,
}) => {
 

  return (
    <div className="w-full flex flex-col justify-between items-start gap-6 lg:gap-0 p-8 lg:p-0">
      {/* Product Details */}
      <div className="text-[#3F66BC] font-medium flex flex-col justify-between gap-1 md:gap-2">
        <h1 className="text-xl lg:text-2xl leading-7 lg:leading-9 text-[#182B55]">
          {variationName}{" "}
        </h1>
        <h3 className="text-base lg:text-lg">SKU: {sku}</h3>
        <Link to="/products">
          <h3 className="text-base md:text-md lg:text-lg">Shop all products</h3>
        </Link>
        <div className="max-w-[260px] w-full text-sm lg:text-lg flex justify-between items-center gap-1">
          <p className="font-semibold">{rating}</p>
          <div className="flex items-center gap-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="w-2">
                {i < Math.floor(rating) ? "⭐" : "☆"}
              </span>
            ))}
            <RiArrowDropDownLine size={30} />
          </div>
          <div className="border-l-2 broder-[#3F66BC] h-4"></div>
          <p className="">{formatNumberWithCommas(totalRatings, true)} ratings</p>
        </div>
        <div className="bg-[#3F66BC] w-3/4 p-2 relative flex items-center text-sm font-semibold gap-2 overflow-hidden h-8">
          <span className="text-white">Pro - Edge's</span>
          <span className="text-[#FCD700]">Choice</span>

          {/* White diagonal cut */}
          <div
            className="absolute -top-0 -right-1 w-20 h-full bg-[#FFFF]"
            style={{
              clipPath: "polygon(0 190%, 100% -6%, 100% 100%)",
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Price Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-medium pt-6 pb-2">
          <span className="text-lg align-super">$</span>{" "}
          <span>{formatNumberWithCommas(currentPrice)}</span>
        </h1>
        {originalPrice > 0 && (
          <p className="text-lg lg:text-xl leading-8">
            <span className="font-medium text-[#3F66BC]">Regular Price: </span>
            <span className="text-[#5D6576] line-through">
              <BsCurrencyDollar/>{formatNumberWithCommas(originalPrice)}
            </span>
          </p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center">
        <p className="text-sm lg:text-base leading-7">
          <span className="text-[#5D6576]">Get Fast, </span>
          <span className="font-medium text-[#182B55] mr-2">
            Free Shipping on Orders Over $500.
          </span>
        </p>
      </div>
      {/* Size Options */}
      <div className="w-full flex flex-col justify-between gap-4 lg:gap-0 pr-3 lg:pr-0">
        <div className="text-md lg:text-lg mb-3 py-2 md:py-6">
          <span className="text-[#5D6576]">Available Options:</span>
          <span className="text-[#3F66BC] font-semibold">
            {" "}
            {variationValue}
          </span>
        </div>

        {priceOptions.length > 0 && (
          <div className="flex justify-start items-start flex-wrap gap-4 max-w-2xl max-h-[300px] md:min-h-[300px] lg:min-h-[200px] overflow-y-auto z-10">
            {priceOptions.map((option) => (
              <VariationCard
                key={option.id}
                title={option.variation_value}
                price={option.offer_price}
                originalPrice={option.regular_price}
                onClick={() => onVariationChange(option)}
                isSelected={option.id === selectedVariationId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVariation;
