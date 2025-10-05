import React, { useContext } from "react";
import CategoryItem from "./CategoryItem";
import { CategoryContext } from "../../../../../context/CategoryContext";
import { ClipLoader } from "react-spinners";

const LeftPanel = ({ onCategoryClick, selectedCategory }) => {
  const { categories, loading, error } = useContext(CategoryContext);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-40">
        <ClipLoader color="#30079f" size={10} />
        <span className="text-blue-600 ml-2">Loading categories...</span>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="lg:w-3/7  border-r border-gray-200">
      <h3 className="text-3xl p-6 font-bold text-[#182B55]">Shop Categories</h3>
      <nav className="space-y-2 overflow-y-auto h-[calc(100vh-100px)] pb-20 px-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            icon={`${import.meta.env.VITE_SERVER_URL}/assets/${
              category.image.id
            }`}
            title={category.category_name}
            totalStock={category.total_stock || 0}
            onClick={() => onCategoryClick(category)}
            isSelected={selectedCategory && selectedCategory.id === category.id}
          />
        ))}
      </nav>
    </div>
  );
};

export default LeftPanel;
