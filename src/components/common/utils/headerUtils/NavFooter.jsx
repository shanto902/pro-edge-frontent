import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import BrowseProduct from "./BrowseProduct";
import { formatCategoryName } from "../../../../helper/slugifier/slugify";
import { CategoryContext } from "../../../../context/CategoryContext";
import { CartContext } from "../../../../context/CartContext";

const Navfooter = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const { categories } = useContext(CategoryContext);
    const { 
    cartItems, 
  } = useContext(CartContext);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      checkScroll();
    }
    return () => {
      if (scrollContainer)
        scrollContainer.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  return (
    <nav
      aria-label="Secondary navigation"
      className="bg-white border-b border-gray-200 shadow-sm sticky top-14 md:top-16 z-50"
    >
      <div className="relative max-w-7xl w-full mx-auto px-4 py-1 flex flex-col md:flex-row items-center justify-between gap-1 md:gap-3">
             {/* Mobile view */}
        <div className="w-full flex flex-shrink-0 items-center justify-between md:hidden">
            <BrowseProduct />
          <Link
            to="/cart"
            title="Cart"
            aria-label="Cart"
            className="relative w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full bg-[#23366B] hover:bg-[#1A2A55] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {/* Notification Badge */}
            {cartItems.length > 0 && (
              <span
                className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center ${
                  cartItems.length > 9 ? "min-w-[20px]" : "w-5 h-5"
                }`}
              >
                {cartItems.length > 99 ? "99+" : cartItems.length}
              </span>
            )}

            {/* Cart Icon */}
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </Link>
        </div>
        {/* Browse Products */}
        <div className="w-full md:w-auto flex-shrink-0 hidden md:block">
          <BrowseProduct />
        </div>

        {/* Categories Scroll */}
        <div className="relative w-full flex items-center overflow-hidden">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 z-10 h-8 w-8 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Scrollable Categories */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-6 scroll-smooth w-full max-w-full px-6 md:px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="flex-shrink-0">
                  <Link
                    to={`/products?parent_category=${formatCategoryName(
                      category.category_name
                    )}-${category.id}`}
                    className="block text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative py-2 group"
                  >
                    {category.category_name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-5 w-20 bg-gray-200 animate-pulse rounded"
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 z-10 h-8 w-8 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <style>{`
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `}</style>
    </nav>
  );
};

export default Navfooter;
