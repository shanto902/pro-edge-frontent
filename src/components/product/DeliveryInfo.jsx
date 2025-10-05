import React, { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../../context/CartContext";
import Price from "./deliveryInfo/Price";
import DeliveryInfocard from "./deliveryInfo/DeliveryInfocard";
import InfoItem from "./deliveryInfo/InfoItem";
import { useNavigate } from "react-router-dom";

const DeliveryInfo = ({
  product,
  productId,
  variationId,
  imageId,
  variation_name,
  offer_price,
  originalPrice,
  stock,
  sku,
  deliveryData
}) => {
  const { cartItems, addToCart, quantity, setQuantity } =
    useContext(CartContext);


  const [isInCart, setIsInCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);

  const navigate = useNavigate();

  

  useEffect(() => {
    const item = cartItems.find((item) => item.variationId === variationId);
    setIsInCart(!!item);
    setCartItem(item);
    if (item) {
      setQuantity(item.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItems, variationId, setQuantity]);

  const numericPrice =
    typeof offer_price === "string"
      ? parseFloat(offer_price.replace(/[^0-9.]/g, ""))
      : Number(offer_price);

  const numericOriginalPrice = originalPrice
    ? typeof originalPrice === "string"
      ? parseFloat(originalPrice.replace(/[^0-9.]/g, ""))
      : Number(originalPrice)
    : null;

  const handleAddToCart = () => {
    const itemToAdd = {
      productId,
      variationId,
      title: product.title,
      variation_name,
      offer_price: numericPrice,
      price: numericOriginalPrice,
      quantity,
      sku,
      image: imageId,
      stock,
    };
    addToCart(itemToAdd);
  };

  const infoItems = [
    { label: "Ships from", value: "Controls Pro" },
    { label: "SKU", value: sku },
    { label: "Returns", value: "30-day refund/replacement" },
    { label: "Payment", value: "Secure transaction" },
  ];

  const handleQuantityChange = (newQuantity) => {
    const numQuantity = parseInt(newQuantity);
    if (isNaN(numQuantity)) return;

    setQuantity(numQuantity);

    if (isInCart && cartItem) {
      const updatedItem = {
        ...cartItem,
        quantity: numQuantity,
      };
      addToCart(updatedItem);
    }
  };

  // Button Component
 const Button = ({
  text,
  bgColor,
  hoverColor,
  textColor,
  onClick,
  disabled,
}) => {
  return (
    <button
      className={`
        ${bgColor} 
        ${textColor} 
        ${disabled ? "opacity-50 cursor-not-allowed blur-[0.3px]" : hoverColor}
        py-2 rounded-full w-full transition-colors
      `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};


  const StockQuantity = ({ stockData }) => {
    const [inputValue, setInputValue] = useState(stockData.selectedQuantity.toString());
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    // Handle input change
    const handleInputChange = (e) => {
      const value = e.target.value;
      setInputValue(value);
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        stockData.onQuantityChange(Math.max(1, numValue)); // Ensure at least 1
      }
    };
  
    // Handle quantity selection from dropdown
    const handleSelectQuantity = (qty) => {
      setInputValue(qty.toString());
      stockData.onQuantityChange(qty);
      setShowDropdown(false);
      inputRef.current?.focus();
    };
  
    // Validate on blur
    const handleInputBlur = () => {
      const numValue = parseInt(inputValue);
      if (isNaN(numValue) || numValue <= 0) {
        const fallback = stockData.quantities[0] || 1;
        setInputValue(fallback.toString());
        stockData.onQuantityChange(fallback);
      }
    };
  
    return (
      <div className="space-y-3 relative">
        <p className={`${stockData.status === "In Stock" ? "text-blue-600" : "text-red-600"} font-medium text-sm`}>
          {stockData.status}
        </p>
  
        {stockData.status === "In Stock" && stockData.quantities.length > 0 && (
          <div className="relative">
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                min="1"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all pr-10"
                placeholder="Enter quantity"
                disabled={stockData.disabled}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDropdown(!showDropdown);
                  inputRef.current?.focus();
                }}
                disabled={stockData.disabled}
              >
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''} ${stockData.disabled ? 'opacity-50' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {showDropdown && (
              <div 
                ref={dropdownRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
              >
                {stockData.quantities.map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                      parseInt(inputValue) === qty ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleSelectQuantity(qty)}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Prepare data for components
  const buttons = [
    {
      text: isInCart ? "View Cart" : stock > 0 ? "Add to Cart" : "Out of Stock",
      bgColor: isInCart ? "bg-[#FCD700]" : stock > 0 ? "bg-[#FCD700]" : "bg-red-500",
      hoverColor: isInCart ? "hover:bg-[#3F66BC]" : stock > 0 ? "hover:bg[#3F66BC]" : "hover:bg-red-500",
      textColor: isInCart ? "text-[#182B255] hover:text-white" : stock > 0 ? "text-[#182B55]" : "text-white",
      onClick: isInCart ? () => navigate("/cart") : handleAddToCart,
      disabled: stock <= 0,
    },
    {
      text: "Proceed To Checkout",
      bgColor: "bg-[#3F66BC]",
      hoverColor: "hover:bg-[#3F66BC]",
      textColor: "text-white",
      onClick: cartItems.length > 0 ? () => navigate("/cart/checkout") : "disabled",
      disabled: !isInCart,
    },
  ];

  const priceData = {
    dollar: "$",
    whole: Math.floor(numericPrice),
    cents: numericPrice.toFixed(2).split(".")[1],
    originalPrice: numericOriginalPrice
      ? numericOriginalPrice.toFixed(2)
      : null,
  };

  // const shippingInfo = {
  //   title: "Get Fast,",
  //   description: "Free Shipping on Orders Over $500.",
  // };

  

  return (
    <div className="max-w-xs w-full rounded-xl border-2 border-[#ECF0F9] bg-[#F8F9FB] p-4 space-y-4">
      <Price priceData={priceData} />
      {/* <ShippingInfo shippingInfo={shippingInfo} /> */}
      <DeliveryInfocard  deliveryData={deliveryData}/>
      <StockQuantity
        stockData={{
          status: stock > 0 ? "In Stock" : "Out of Stock",
          quantities: [1, 2, 3, 4, 5, 10, 15],
          selectedQuantity: quantity,
          onQuantityChange: handleQuantityChange,
          disabled: stock <= 0,
        }}
      />

      {isInCart && (
        <div className="text-center text-sm text-green-600">
          {quantity} in cart
        </div>
      )}

      <div className="space-y-2">
        {buttons.map((button, index) => (
          <Button key={index} {...button} />
        ))}
      </div>

      <div className="text-xs text-[#5D6576] space-y-1">
        {infoItems.map((item, index) => (
          <InfoItem key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};

export default DeliveryInfo;