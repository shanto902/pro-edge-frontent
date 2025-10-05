import { Link } from "react-router-dom";
import { formatCategoryName } from "../../../../../helper/slugifier/slugify";

const SubcategoryList = ({ title, items, selectedCategoryId, closeBar }) => (
  <div className="space-y-3">
    <h3 className="font-semibold text-[#3F66BC]  hover:text-[#2E4A8E] mb-2 hover:cursor-pointer" onClick={closeBar}>
    <Link to={`/products?sub_category=${formatCategoryName(
          title
        )}-${selectedCategoryId}`}>
      {title}
    </Link>
    </h3>
    <h3 className="font-semibold " onClick={closeBar}>
      <Link
        to={`/products?sub_category=${formatCategoryName(
          title
        )}-${selectedCategoryId}`}
        className="text-[#3F66BC]  hover:text-[#2E4A8E] transition-colors"
      >
        Shop All
      </Link>
    </h3>

    <ul className="space-y-2 text-sm ">
      {items.map((item, index) => (
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
  </div>
);

export default SubcategoryList;
