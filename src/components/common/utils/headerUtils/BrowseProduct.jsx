import React, { useState, useEffect, useRef, useContext } from "react";
import MenuIcon from "./browseProduct/icons/MenuIcons";
import DropdownArrowIcon from "./browseProduct/icons/DropDownArrow";
import LeftPanel from "./browseProduct/LeftPanel";
import RightPanel from "./browseProduct/RightPanel";
import { CategoryContext } from "../../../../context/CategoryContext";
import RightArrowIcon from "./browseProduct/icons/RightArrowIcon";
import MobilePanel from "./MobilePanel";

const BrowseProduct = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const dropdownRef = useRef(null);
  const { categories } = useContext(CategoryContext);
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 1000);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleHover = (state) => {
    if (!mobileView) {
      // Only apply hover effects on desktop
      setIsOpen(state);
      if (state && categories.length > 0 && !selectedCategory) {
        setSelectedCategory(categories[0]);
      }
    }
  };

  
  return (
    <div
      className="relative group w-full max-w-2xs"
      ref={dropdownRef}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!selectedCategory && categories.length > 0) {
            setSelectedCategory(categories[0]); // auto-select on click if none
          }
        }}
        className="w-full px-5 py-1 md:py-2 bg-[#182B55] md:bg-gray-100  text-white md:text-[#182B55]  rounded-full md:rounded-none flex justify-between items-center gap-2 transition-all z-10"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MenuIcon/>
        <span className="text-xs md:text-lg font-medium">Browse Products</span>
        <RightArrowIcon className={`block md:hidden text-white md:text-blue-900`}/>
        <DropdownArrowIcon
          className={`hidden md:block text-white md:text-blue-900  transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div className="absolute top-full left-0 w-full h-2 md:h-7 z-40"></div>

      {/* Mobile Full-screen Panel */}
      {mobileView && (
        <MobilePanel
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Desktop View  */}

      {!mobileView && (
        <div
          className={`absolute top-full -translate-x-5 mt-2 md:w-4xl z-40 ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } transition-all duration-300`}
        >
          <div className="bg-white rounded-xl shadow-xl py-6 pr-6">
            <div className="flex flex-col lg:flex-row min-h-[400px]">
              <LeftPanel
                onCategoryClick={handleCategoryClick}
                selectedCategory={selectedCategory}
              />
              <RightPanel
                setIsOpen={setIsOpen}
                selectedCategory={selectedCategory}
                handleHover={handleHover}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseProduct;
