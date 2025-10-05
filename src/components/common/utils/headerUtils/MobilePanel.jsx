import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CategoryContext } from "../../../../context/CategoryContext";
import RightArrowIcon from "./browseProduct/icons/RightArrowIcon";
import { formatCategoryName } from "../../../../helper/slugifier/slugify";
import { ClipLoader } from "react-spinners";

const MobilePanel = ({
  isOpen,
  setIsOpen,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { categories, loading, error } = useContext(CategoryContext);
  const panelRef = useRef(null);
  const firstCategoryRef = useRef(null);
  const firstSubcategoryRef = useRef(null);

  const closePanel = () => setIsOpen(false);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
      if (selectedCategory && firstSubcategoryRef.current) {
        firstSubcategoryRef.current.focus();
      } else if (firstCategoryRef.current) {
        firstCategoryRef.current.focus();
      }
    }
  }, [isOpen, selectedCategory]);

  // Close panel on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closePanel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-40">
        <ClipLoader color="#30079f" size={10} />
        <span className="text-blue-600 ml-2">Loading categories...</span>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      ref={panelRef}
      className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Product categories"
      tabIndex={-1}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <button
            onClick={closePanel}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Close menu"
          >
            <RightArrowIcon className="transform rotate-180 w-5 h-5 text-blue-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            Browse Products
          </h2>
          <div className="w-8" aria-hidden="true" />
        </header>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <nav
            aria-label="Main categories"
            className="w-1/4 border-r border-gray-200 overflow-y-auto space-y-2 bg-gray-50"
          >
            {categories.map((category, index) => (
              <button
                ref={index === 0 ? firstCategoryRef : null}
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`w-full flex flex-col items-center gap-2 p-3 transition-all ${
                  selectedCategory?.id === category.id
                    ? "bg-blue-900 text-white shadow-md"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-current={
                  selectedCategory?.id === category.id ? "true" : "false"
                }
              >
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}/assets/${
                    category.image.id
                  }`}
                  alt=""
                  aria-hidden="true"
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <span className="text-xs font-medium text-center truncate w-full">
                  {category.category_name}
                </span>
              </button>
            ))}
          </nav>

          {/* Main Panel */}
          <main className="w-3/4 overflow-y-auto p-4">
            {selectedCategory ? (
              <div className="space-y-6">
                {/* Category Header */}
                <div className="flex justify-between items-center mb-4">
                  <Link
                    to={`/products?parent_category=${formatCategoryName(
                      selectedCategory.category_name
                    )}-${selectedCategory.id}`}
                    onClick={closePanel}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {selectedCategory.category_name}
                  </Link>
                  <Link
                    to={`/products?parent_category=${formatCategoryName(
                      selectedCategory.category_name
                    )}-${selectedCategory.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none px-2 py-1 rounded"
                    onClick={closePanel}
                  >
                    Shop All
                  </Link>
                </div>

                {/* Subcategories */}
                <div className="space-y-6">
                  {selectedCategory.sub_category?.map(
                    (subcategory, subIndex) => (
                      <section key={subcategory.id} className="space-y-2">
                        <Link
                          to={`/products?sub_category=${formatCategoryName(
                            subcategory.subcategory_name
                          )}-${subcategory.id}`}
                          onClick={closePanel}
                          className="block text-sm font-semibold text-blue-600 px-2 hover:text-[#3F66BC] transition-colors"
                        >
                          {subcategory.subcategory_name}
                        </Link>

                        <ul className="space-y-1">
                          {subcategory.child_category?.map(
                            (child, childIndex) => (
                              <li key={child.id}>
                                <Link
                                  ref={
                                    subIndex === 0 && childIndex === 0
                                      ? firstSubcategoryRef
                                      : null
                                  }
                                  to={`/products?child_category=${formatCategoryName(
                                    child.child_category_name
                                  )}-${child.id}`}
                                  onClick={closePanel}
                                  className="flex justify-between items-center text-sm py-2 px-3 rounded-md hover:bg-gray-100 transition text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-100"
                                >
                                  <span className="truncate">
                                    {child.child_category_name}
                                  </span>
                                  <span className="text-xs text-blue-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {child.total_stock}
                                  </span>
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      </section>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <svg
                  className="w-12 h-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                  />
                </svg>
                <p className="text-sm">
                  Select a category to view subcategories
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MobilePanel;
