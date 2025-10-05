import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsCurrencyDollar, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { CartContext } from "../../../../context/CartContext";
import { formatNumberWithCommas } from "../../../../helper/localPrice/localeprice";

const ProductCard = ({
  productId,
  variationId,
  variation_name,
  dropdownRef,
  variation,
  stock,
  made_in,
  sku,
  image,
  image_url,
  category,
  title,
  price,
  length,
  allVariations = [],
  isOpen, // New prop - controls if this dropdown is open
  onToggle, // New prop - function to toggle this dropdown
}) => {
  const getImage = () => {
    if (image_url && image_url !== "NULL") return image_url;
    if (image && image !== "NULL")
      return `${import.meta.env.VITE_SERVER_URL}/assets/${image}`;
    return "";
  };

  const {
    addToCart,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    cartItems,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const isInCart = cartItems.some((item) => item.variationId === variationId);
  const isWishlisted = isInWishlist(variationId);

  // Filter out the current variation from the list
  const otherVariations = allVariations.filter(
    (v) => v.variationId !== variationId
  );
  const hasOtherVariations = otherVariations.length > 0;

  const handleClick = () => {
    const slug = variation_name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .slice(0, 20)
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    navigate(`/single-product/${slug}-${variationId}-${productId}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    const product = {
      productId,
      variationId,
      variation_name,
      stock,
      sku,
      image,
      image_url,
      category,
      title,
      price,
    };
    if (isWishlisted) {
      removeFromWishlist(product);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const product = {
      productId,
      variationId,
      variation_name,
      stock,
      sku,
      image,
      image_url,
      category,
      title,
      price,
    };
    if (isInCart) {
      navigate("/cart");
    } else {
      addToCart(product);
    }
  };

  const toggleVariations = (e) => {
    e.stopPropagation();
    onToggle(); // Call the parent's toggle function
  };

  const handleVariationClick = (e, variation) => {
    e.stopPropagation();
    const slug = variation.variation_name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .slice(0, 20)
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    navigate(`/single-product/${slug}-${variation.variationId}-${productId}`);
    onToggle(); // Close the dropdown after selection
  };

  return (
    <div
      onClick={handleClick}
      className="max-w-xs w-full my-1 md:my-4 rounded-xl border-2 border-[#F8F9FB] md:hover:border-[#3F66BC] px-4 pt-4 pb-6 bg-[#FFFFFF] drop-shadow-[#E1E1E140] drop-shadow-md hover:drop-shadow-md hover:scale-105 transition duration-300 cursor-pointer relative"
    >
      <div className="rounded-xl w-full h-[417px] mb-5 bg-[#FFFFFF]">
        <div className="bg-[#F8F9FB] flex justify-center items-center relative rounded-xl w-full overflow-hidden">
          <img
            src={getImage()}
            alt="Product"
            className="h-[167px] w-full object-cover rounded-lg"
          />

          <div
            onClick={handleWishlistClick}
            className={`group rounded-full w-9 h-9 flex items-center hover:border-1 hover:border-[#EE2738] justify-center shadow-lg absolute top-2 right-2 transition duration-300 cursor-pointer ${
              isWishlisted
                ? "bg-[#EE2738] hover:bg-red-800"
                : "bg-[#FFFFFF] hover:bg-red-300"
            } transition-all duration-200`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition duration-300"
            >
              <path
                d="M8.99998 15.5C8.46248 15.0233 7.85498 14.5275 7.21248 14H7.20415C4.94165 12.15 2.37748 10.0566 1.24498 7.54829C0.87291 6.74973 0.675732 5.8809 0.666635 4.99996C0.664151 3.7912 1.14895 2.63245 2.01149 1.7856C2.87402 0.938751 4.04147 0.475289 5.24998 0.49996C6.23384 0.501514 7.19651 0.785861 8.02331 1.31913C8.38662 1.55493 8.71533 1.84017 8.99998 2.16663C9.28622 1.84145 9.61502 1.55638 9.97748 1.31913C10.8039 0.785756 11.7664 0.501392 12.75 0.49996C13.9585 0.475289 15.1259 0.938751 15.9885 1.7856C16.851 2.63245 17.3358 3.7912 17.3333 4.99996C17.3248 5.88231 17.1276 6.75262 16.755 7.55246C15.6225 10.0608 13.0591 12.1533 10.7966 14L10.7883 14.0066C10.145 14.5308 9.53831 15.0266 9.00081 15.5066L8.99998 15.5ZM5.24998 2.16663C4.47374 2.15691 3.72504 2.454 3.16665 2.99329C2.62863 3.52176 2.32794 4.24583 2.33324 4.99996C2.34275 5.64204 2.48817 6.27484 2.75998 6.85663C3.29457 7.93888 4.0159 8.91834 4.89081 9.74996C5.71665 10.5833 6.66665 11.39 7.48831 12.0683C7.71581 12.2558 7.94748 12.445 8.17915 12.6341L8.32498 12.7533C8.54748 12.935 8.77748 13.1233 8.99998 13.3083L9.01081 13.2983L9.01581 13.2941H9.02081L9.02831 13.2883H9.03248H9.03664L9.05165 13.2758L9.08581 13.2483L9.09165 13.2433L9.10081 13.2366H9.10581L9.11331 13.23L9.66665 12.7758L9.81165 12.6566C10.0458 12.4658 10.2775 12.2766 10.505 12.0891C11.3266 11.4108 12.2775 10.605 13.1033 9.76746C13.9783 8.93626 14.6997 7.95706 15.2341 6.87496C15.5109 6.28813 15.6584 5.64872 15.6667 4.99996C15.6701 4.24816 15.3696 3.52687 14.8333 2.99996C14.276 2.45823 13.5272 2.1587 12.75 2.16663C11.8016 2.15857 10.8949 2.5561 10.2583 3.25913L8.99998 4.70913L7.74165 3.25913C7.10503 2.5561 6.19838 2.15857 5.24998 2.16663Z"
                className={`transition duration-300 ${
                  isWishlisted ? "fill-white" : "fill-[#182B55] "
                }`}
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col justify-between items-start h-[247px] w-full">
          <div className="mb-2">
            <h2 className="text-[14px] text-[#3F66BC] font-medium leading-10">
              {category}
            </h2>

            <h1 className="text-[#182B55] text-lg font-medium leading-[30px] cursor-pointer">
              {variation_name}
            </h1>
          </div>

          {hasOtherVariations && (
            <div className="relative">
              <button
                onClick={toggleVariations}
                className="text-[#3F66BC] text-sm font-medium mb-2 hover:underline flex items-center gap-1"
              >
                +{otherVariations.length} more options
                {isOpen ? (
                  <BsChevronUp className="text-xs" />
                ) : (
                  <BsChevronDown className="text-xs" />
                )}
              </button>

              {/* Variations dropdown */}
              {isOpen && (
                <div
                 ref={dropdownRef}
                  className={`absolute  z-20 mt-1 w-48 max-h-60 ${
                    otherVariations.length > 3 ? "-top-60" : `-top-40`
                  } overflow-y-auto bg-white rounded-md shadow-lg border border-[#3F66BC]`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    {/* Current variation */}
                    <div
                      className="flex items-center justify-between px-4 py-2 text-sm cursor-pointer bg-[#F8F9FB]"
                      onClick={handleClick}
                    >
                      <span className="font-medium">
                        {variation.variation_value}
                      </span>
                    </div>

                    {/* Other variations */}
                    {otherVariations.map((v) => (
                      <div
                        key={v.variationId}
                        className="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-[#F8F9FB]"
                        onClick={(e) => handleVariationClick(e, v)}
                      >
                        <span className="font-medium">
                          {v.variation.variation_value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-[10px]">
            <p className="text-[#3F66BC] text-xl font-semibold leading-8 gap-y-2.5 flex items-center justify-start">
              <BsCurrencyDollar /> {formatNumberWithCommas(price)}
            </p>
          </div>
          <div
            onClick={handleAddToCart}
            className={`rounded-[60px] text-center w-full h-[40px] py-2 px-6 flex items-center justify-center hover:bg-[#e6c200] cursor-pointer transition duration-300 ${
              isInCart
                ? "bg-[#182B55] text-white"
                : "bg-[#FCD700] text-[#182B55]"
            }`}
          >
            <h3 className="text-[16px] font-medium leading-6">
              {isInCart ? "View Cart" : "Add to Cart"}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
