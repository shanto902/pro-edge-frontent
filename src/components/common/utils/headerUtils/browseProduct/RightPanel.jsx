import React from "react";
import { Link } from "react-router-dom";
import SubcategoryList from "./SubCategoryList";
import { formatCategoryName } from "../../../../../helper/slugifier/slugify";

const RightPanel = ({ selectedCategory, setIsOpen }) => {
  if (!selectedCategory) {
    return (
      <div className="lg:w-4/7 p-6 text-gray-500">
        Select a category to view subcategories
      </div>
    );
  }

  const closeBar = () => {
    setIsOpen(false);
  };

  // console.log(selectedCategory, "se");
  return (
    <div className="lg:w-4/7 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#182B55]">
          {selectedCategory.category_name}
        </h2>
        <Link
          to={`/products?parent_category=${formatCategoryName(
            selectedCategory.category_name
          )}-${selectedCategory.id}`}
          className="text-[#3F66BC] text-md hover:text-[#2E4A8E] transition-colors"
          onClick={closeBar}
        >
          Shop All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
        {selectedCategory.sub_category.map((sub) => (
          <SubcategoryList
            closeBar={closeBar}
            key={sub.id}
            title={sub.subcategory_name}
            items={sub.child_category.map((child) => ({
              name: child.child_category_name,
              count: child.total_stock,
              path: `/products?child_category=${formatCategoryName(
                child.child_category_name
              )}-${child.id}`,
              sub_category: sub.subcategory_name,
            }))}
            selectedCategoryId={sub.id}
          />
        ))}
      </div>
    </div>
  );
};

export default RightPanel;
