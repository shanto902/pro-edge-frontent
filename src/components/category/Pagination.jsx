import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPages = () => {
    const pages = [];

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="w-10 h-10 rounded-full border text-blue-500 hover:bg-blue-100 flex items-center justify-center"
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </button>
      );
    }

    // Show first page
    if (currentPage > 2) {
      pages.push(
        <button
          key={1}
          className="w-10 h-10 rounded-full border text-blue-500 hover:bg-blue-100 flex items-center justify-center"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
    }

    // Show previous page if needed
    if (currentPage > 3) {
      pages.push(
        <span key="dots1" className="text-gray-500">
          ...
        </span>
      );
    }

    // Show current page -1, current page, current page +1
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(
          <button
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center border ${
              i === currentPage
                ? "bg-blue-500 text-white"
                : "text-blue-500 hover:bg-blue-100"
            }`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      }
    }

    // Show dots if not near the last page
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="dots2" className="text-gray-500">
          ...
        </span>
      );
    }

    // Show last page
    if (currentPage < totalPages - 1) {
      pages.push(
        <button
          key={totalPages}
          className="w-10 h-10 rounded-full border text-blue-500 hover:bg-blue-100 flex items-center justify-center"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="w-10 h-10 rounded-full border text-blue-500 hover:bg-blue-100 flex items-center justify-center"
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-2 mb-5">
      {renderPages()}
    </div>
  );
};

export default Pagination;
