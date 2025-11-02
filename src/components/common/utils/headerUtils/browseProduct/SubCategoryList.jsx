import { Link } from "react-router-dom";
import { formatCategoryName } from "../../../../../helper/slugifier/slugify";

const SubcategoryList = ({ title, items, selectedCategoryId, closeBar }) => {
  const allItems = Array.isArray(items) ? items : [];

  // Split into named vs empty-name items
  const namedItems = allItems.filter(
    (it) => it && typeof it.name === "string" && it.name.trim() !== ""
  );
  const unnamedCount = allItems
    .filter((it) => !it || !it.name || it.name.trim() === "")
    .reduce((acc, it) => acc + (it?.count || 0), 0);

  const hasNamedItems = namedItems.length > 0;

  // If parent title itself is empty, show “All (total)” and stop
  if (!title || title.trim() === "") {
    const totalCount = allItems.reduce((acc, it) => acc + (it?.count || 0), 0);
    return (
      <div className="space-y-3">
        <h3
          className="font-semibold text-[#3F66BC] hover:text-[#2E4A8E] mb-2 hover:cursor-pointer"
          onClick={closeBar}
        >
          <Link to="#">
            All <span className="text-[#3F66BC] text-sm ml-2">({totalCount})</span>
          </Link>
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Parent title with extra count from empty-name items */}
      <h3
        className="font-semibold text-[#3F66BC] hover:text-[#2E4A8E] mb-2 hover:cursor-pointer"
        onClick={closeBar}
      >
        <Link
          to={`/products?sub_category=${formatCategoryName(title)}-${selectedCategoryId}`}
        >
          {title}
          {unnamedCount > 0 && (
            <span className="text-[#3F66BC] text-sm ml-2">({unnamedCount})</span>
          )}
        </Link>
      </h3>

      {/* Shop All only if we actually have visible (named) sub-items */}
      {hasNamedItems && (
        <h3 className="font-semibold" onClick={closeBar}>
          <Link
            to={`/products?sub_category=${formatCategoryName(title)}-${selectedCategoryId}`}
            className="text-[#3F66BC] hover:text-[#2E4A8E] transition-colors"
          >
            Shop All
          </Link>
        </h3>
      )}

      {/* Visible sub-items (hide empty-name rows) */}
      {hasNamedItems && (
        <ul className="space-y-2 text-sm">
          {namedItems.map((item, index) => (
            <li key={index} onClick={closeBar}>
              <Link
                to={item.path}
                className="flex justify-between items-center text-gray-600 hover:text-[#95a3c2]"
              >
                <span>{item.name}</span>
                {item.count > 0 && (
                  <span className="text-[#3F66BC] text-sm">({item.count})</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubcategoryList;
