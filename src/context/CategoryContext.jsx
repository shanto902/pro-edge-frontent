// src/contexts/CategoryContext.js
import {
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { formatCategoryName } from "../helper/slugifier/slugify";

export const CategoryContext = createContext({
  categories: [],
  singleCategory: null,
  setSingleCategory: () => {},
  loading: false,
  error: null,
});

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [singleCategory, setSingleCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const location = useLocation();
  const GRAPHQL_URL = import.meta.env.VITE_SERVER_URL + "/graphql";

  const fetchCategoriesAndStock = async () => {
    setLoading(true);
    try {
      // 1. Fetch all category structure
      const categoryRes = await axios.post(
        GRAPHQL_URL,
        {
          query: `
            {
              parent_category(limit: -1) {
                id
                category_name
                image {
                  id
                }
                banner_image {
                  id
                }
                sub_category {
                  id
                  subcategory_name
                  child_category {
                    id
                    child_category_name
                  }
                }
              }
            }
          `,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const parentCategories = categoryRes.data?.data?.parent_category || [];

      // 2. Fetch all products with child category + stock
      const productRes = await axios.post(
        GRAPHQL_URL,
        {
          query: `
            {
              product(limit: -1) {
                product_category {
                  id
                }
                variation {
                  stock
                }
              }
            }
          `,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const allProducts = productRes.data?.data?.product || [];
// Group COUNT by child category (how many products), not total stock
// const stockMap = {};
// for (const product of allProducts) {
//   const childId = product.product_category?.id;

//   // count product once if it has any variation with stock > 0
//   const hasStock = (product.variation || []).some(
//     (v) => Number(v.stock) > 0
//   );

//   if (childId && hasStock) {
//     stockMap[childId] = (stockMap[childId] || 0) + 1;
//   }
// }

// 3. Group COUNT by child category, counting variations (not products)
const stockMap = {};
for (const product of allProducts) {
  const childId = product.product_category?.id;

  // count how many variations this product has, with stock > 0
  const variationCount = (product.variation || []).reduce((sum, v) => {
    const hasStock = Number(v.stock) > 0;   // or just `true` if you do not care about stock
    return hasStock ? sum + 1 : sum;
  }, 0);

  if (childId && variationCount > 0) {
    stockMap[childId] = (stockMap[childId] || 0) + variationCount;
  }
}


      // 4. Inject stock into category tree
      for (const parent of parentCategories) {
        let parentStock = 0;

        for (const sub of parent.sub_category || []) {
          let subStock = 0;

          for (const child of sub.child_category || []) {
            const childStock = stockMap[child.id] || 0;
            child.total_stock = childStock;
            subStock += childStock;
          }

          sub.total_stock = subStock;
          parentStock += subStock;
        }

        parent.total_stock = parentStock;
      }

      setCategories(parentCategories);
      setError(null);
    } catch (err) {
      console.error("Category fetch error:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCategoriesAndStock();
  }, []);

  // Formatter that adds slug and toggle flags to any category tree
  const formatCategories = useMemo(() => {
    return (cats) => {
      const processCategory = (category) => {
        const name =
          category.category_name ||
          category.child_category_name ||
          category.subcategory_name ||
          "";
        const slug = `${formatCategoryName(name)}-${category.id}`;

        const newCategory = {
          ...category,
          slug,
          toggle: false,
        };

        if (category.sub_category) {
          newCategory.sub_category = category.sub_category.map(processCategory);
        }

        if (category.child_category) {
          newCategory.child_category =
            category.child_category.map(processCategory);
        }

        return newCategory;
      };

      return (cats || []).map(processCategory);
    };
  }, []);

  // Auto select category tree from URL query
  useEffect(() => {
    if (!categories?.length) return;

    const query = new URLSearchParams(location.search);
    const parentSlug = query.get("parent_category");
    const subSlug = query.get("sub_category");
    const childSlug = query.get("child_category");

    const formatted = formatCategories(categories || []);

    formatted.forEach((parent) => {
      let parentHasMatch = false;

      // Parent level
      if (parentSlug) {
        parent.toggle = parent.slug === parentSlug;
        parentHasMatch = parent.toggle;
      }

      // Sub level
      parent.sub_category?.forEach((sub) => {
        let subHasMatch = false;

        if (subSlug) {
          sub.toggle = sub.slug === subSlug;
          subHasMatch = sub.toggle;
        }

        // Child level
        if (childSlug) {
          sub.child_category?.forEach((child) => {
            if (childSlug === child.slug) {
              child.toggle = true;
              subHasMatch = true;
              parentHasMatch = true;
            } else {
              child.toggle = false;
            }
          });
        }

        if (subSlug) {
          sub.toggle = sub.slug === subSlug;
          if (sub.toggle) parentHasMatch = true;
        } else {
          sub.toggle = subHasMatch;
        }
      });

      // Final parent toggle. if no explicit parentSlug, inherit from children
      if (parentSlug) {
        parent.toggle = parent.slug === parentSlug;
      } else {
        parent.toggle = parentHasMatch;
      }
    });

    const finalFormatted = formatted.filter((parent) => parent.toggle === true);
    setSingleCategory(finalFormatted[0] || null);
  }, [location.search, categories, formatCategories]);

  const contextValue = useMemo(
    () => ({
      categories,
      singleCategory,
      setSingleCategory,
      loading,
      error,
    }),
    [categories, singleCategory, loading, error]
  );

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
}
