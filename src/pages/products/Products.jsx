import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import levenshtein from "fast-levenshtein";
import Filter from "../../components/category/Filter";
import Pagination from "../../components/category/Pagination";
import { IoFilterSharp } from "react-icons/io5";

import { useProductContext } from "../../context/ProductContext";
import PageHeader from "../../components/common/utils/banner/SubPageHeader";
import bgImage from "../../assets/images/cart.png";
import { CartContext } from "../../context/CartContext";
import { Helmet } from "react-helmet-async";
import ProductCard from "../../components/common/utils/cards/ProductCard";
import { fetchPageBlocks } from "../../context/PageContext";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { CategoryContext } from "../../context/CategoryContext";

const slugifyKey = (s = "") =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const safeParseFilters = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const Category = () => {
  const [openVariationId, setOpenVariationId] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [sortOption, setSortOption] = useState("Relevance");
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [searchParams] = useSearchParams();

  const { wishlistItems } = useContext(CartContext);
  const {
    minPrice,
    maxPrice,
    isMadeUsa,
    searchTerm,
    setSearchTerm,
    fetchProducts,
    loading,
  } = useProductContext();
  const { singleCategory } = useContext(CategoryContext);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });
  const { data: blocks = [] } = useQuery({
    queryKey: ["pageBlocks", "products"],
    queryFn: () => fetchPageBlocks("products"),
    staleTime: 1000 * 60 * 5,
  });

  const breadcrumb = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "breadcrumb"
  )[0];

  // slug util for category slugs
  const generateSlug = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const dropdownRef = useRef(null);

  const handleToggleVariations = (variationId) => {
    setOpenVariationId(openVariationId === variationId ? null : variationId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenVariationId(null);
      }
    };
    if (openVariationId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openVariationId]);

  // Add slugs to product + nested categories
  const productsWithSlugs = useMemo(() => {
    return products.map((product) => {
      const parentName =
        product.product_category?.sub_category?.parent_category
          ?.category_name || "";
      const subName =
        product.product_category?.sub_category?.subcategory_name || "";
      const childName = product.product_category?.child_category_name || "";

      const parentId =
        product.product_category?.sub_category?.parent_category?.id || "";
      const subId = product.product_category?.sub_category?.id || "";
      const childId = product.product_category?.id || "";

      const parentSlug = parentName
        ? `${generateSlug(parentName)}-${parentId}`
        : "";
      const subSlug = subName ? `${generateSlug(subName)}-${subId}` : "";
      const childSlug = childName
        ? `${generateSlug(childName)}-${childId}`
        : "";

      const productSlug = [parentSlug, subSlug, childSlug]
        .filter(Boolean)
        .join("-");

      return {
        ...product,
        slug: product.slug || productSlug,
        product_category: {
          ...product.product_category,
          slug: childSlug,
          sub_category: {
            ...product.product_category?.sub_category,
            slug: subSlug,
            parent_category: {
              ...product.product_category?.sub_category?.parent_category,
              slug: parentSlug,
            },
          },
        },
      };
    });
  }, [products]);

  // --------- SEARCH ----------
  const performSearch = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      return productsWithSlugs;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    const tokens = lowerCaseSearchTerm.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    const fieldConfig = {
      title: { weight: 10, exactMatchBonus: 5 },
      sku_code: { weight: 8, exactMatchBonus: 4 },
      variation_value: { weight: 6, exactMatchBonus: 3 },
      variation_name: { weight: 5, exactMatchBonus: 2 },
      feature_name: { weight: 4, exactMatchBonus: 2 },
      feature_value: { weight: 4, exactMatchBonus: 2 },
      child_category_name: { weight: 7, exactMatchBonus: 3 },
      subcategory_name: { weight: 6, exactMatchBonus: 2 },
      category_name: { weight: 5, exactMatchBonus: 2 },
      product_info: { weight: 0.5, exactMatchBonus: 0 },
      product_details: { weight: 0.5, exactMatchBonus: 0 },
    };

    const getCategoryNames = (product) => {
      const categories = [];
      if (product.product_category) {
        if (product.product_category.child_category_name) {
          categories.push({
            name: product.product_category.child_category_name.toLowerCase(),
            type: "child_category_name",
          });
        }
        if (product.product_category.sub_category?.subcategory_name) {
          categories.push({
            name: product.product_category.sub_category.subcategory_name.toLowerCase(),
            type: "subcategory_name",
          });
        }
        if (
          product.product_category.sub_category?.parent_category?.category_name
        ) {
          categories.push({
            name: product.product_category.sub_category.parent_category.category_name.toLowerCase(),
            type: "category_name",
          });
        }
      }
      return categories;
    };

    // exact category match first
    const exactCategoryMatch = productsWithSlugs.filter((product) => {
      const categories = getCategoryNames(product);
      return categories.some((c) => c.name === lowerCaseSearchTerm);
    });
    if (exactCategoryMatch.length > 0) return exactCategoryMatch;

    const scoreFieldMatch = (fieldValue, token, fieldName) => {
      if (!fieldValue) return 0;
      const config = fieldConfig[fieldName] || { weight: 1 };
      let score = 0;

      if (fieldValue === token) {
        score += config.weight + (config.exactMatchBonus || 0);
      } else if (fieldValue.startsWith(token)) {
        score += config.weight * 0.8;
      } else if (fieldValue.includes(token)) {
        score += config.weight * 0.6;
      } else {
        const distance = levenshtein.get(fieldValue, token);
        const length = Math.max(fieldValue.length, token.length);
        const similarity = 1 - distance / length;
        if (similarity > 0.7) {
          score += config.weight * similarity * 0.5;
        }
      }
      return score;
    };

    const scoreVariation = (product, variation) => {
      let totalScore = 0;
      let matchedTokens = new Set();

      const processField = (value, fieldName) => {
        if (!value) return;
        const lowerValue = value.toLowerCase();
        tokens.forEach((token) => {
          const tokenScore = scoreFieldMatch(lowerValue, token, fieldName);
          if (tokenScore > 0) {
            totalScore += tokenScore;
            matchedTokens.add(token);
          }
        });
      };

      processField(product.title, "title");
      const categoryNames = getCategoryNames(product);
      categoryNames.forEach((category) => {
        processField(category.name, category.type);
      });

      processField(variation.variation_name, "variation_name");
      processField(variation.variation_value, "variation_value");
      processField(variation.sku_code, "sku_code");
      processField(variation.product_info, "product_info");
      processField(variation.product_details, "product_details");

      variation.features?.forEach((feature) => {
        processField(feature.feature_name, "feature_name");
        processField(feature.feature_value, "feature_value");
      });

      const tokenCoverage = matchedTokens.size / tokens.length;
      totalScore *= 1 + tokenCoverage * 0.5;

      if (tokens.length > 1) {
        const phrase = tokens.join(" ");
        const importantFields = [
          product.title?.toLowerCase(),
          ...categoryNames.map((c) => c.name),
          variation.variation_name?.toLowerCase(),
          variation.sku_code?.toLowerCase(),
        ];
        if (importantFields.some((field) => field?.includes(phrase))) {
          totalScore *= 1.5;
        }
      }

      return { score: totalScore, matchedTokens: matchedTokens.size };
    };

    const scoredResults = [];

    productsWithSlugs.forEach((product) => {
      product.variation?.forEach((variation) => {
        const { score, matchedTokens } = scoreVariation(product, variation);
        if (score > 0.1) {
          scoredResults.push({ product, variation, score, matchedTokens });
        }
      });
    });

    scoredResults.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.matchedTokens - a.matchedTokens;
    });

    const productMap = new Map();
    scoredResults.forEach((result) => {
      const existing = productMap.get(result.product._id);
      if (!existing || result.score > existing.score) {
        productMap.set(result.product._id, {
          ...result.product,
          bestMatchScore: result.score,
          bestMatchVariation: result.variation,
          matchedTokens: result.matchedTokens,
        });
      }
    });

    const finalResults = Array.from(productMap.values());
    finalResults.sort((a, b) => {
      if (b.bestMatchScore !== a.bestMatchScore)
        return b.bestMatchScore - a.bestMatchScore;
      return b.matchedTokens - a.matchedTokens;
    });

    if (finalResults.length < 10) {
      const existingIds = finalResults.map((p) => p._id);
      const fallback = productsWithSlugs.filter(
        (product) =>
          !existingIds.includes(product._id) &&
          getCategoryNames(product).some((c) =>
            tokens.some((token) => c.name.includes(token))
          )
      );
      finalResults.push(...fallback);
    }

    return finalResults;
  }, [productsWithSlugs, searchTerm]);

  // --------- CATEGORY FILTERING ----------
  const categoryFilteredProducts = useMemo(() => {
    return performSearch.filter((product) => {
      const productChildSlug = product.product_category?.slug;
      const productSubSlug = product.product_category?.sub_category?.slug;
      const productParentSlug =
        product.product_category?.sub_category?.parent_category?.slug;

      if (
        !singleCategory?.toggle &&
        !singleCategory?.sub_category?.some((sub) => sub.toggle)
      ) {
        return true;
      }

      const parentMatch =
        singleCategory?.toggle && singleCategory.slug === productParentSlug;

      if (singleCategory?.toggle && !parentMatch) return false;

      const hasToggledSub = singleCategory?.sub_category?.some(
        (sub) => sub.toggle
      );
      if (!hasToggledSub) return true;

      const subMatch = singleCategory?.sub_category?.some(
        (sub) => sub.toggle && sub.slug === productSubSlug
      );
      if (!subMatch) return false;

      const matchedSub = singleCategory.sub_category.find(
        (sub) => sub.toggle && sub.slug === productSubSlug
      );
      const hasToggledChild = matchedSub?.child_category?.some(
        (child) => child.toggle
      );

      if (!hasToggledChild) return true;

      const childMatch = matchedSub.child_category.some(
        (child) => child.toggle && child.slug === productChildSlug
      );
      return childMatch;
    });
  }, [performSearch, singleCategory]);

  // --------- DYNAMIC VARIATION FILTERS (from URL) ----------
  // Map<groupSlug, Set<values>>
  const selectedDynamicFilters = useMemo(() => {
    const map = new Map();
    for (const [k, v] of searchParams.entries()) {
      if (k.startsWith("filter_") && v) {
        const groupSlug = k.slice("filter_".length);
        const values = v
          .split("|")
          .map((x) => decodeURIComponent(x))
          .filter(Boolean);
        if (values.length) map.set(groupSlug, new Set(values));
      }
    }
    return map;
  }, [searchParams]);

  const hasDynamicSelections = selectedDynamicFilters.size > 0;

  const variationMatchesDynamic = (variation) => {
    if (!hasDynamicSelections) return true;

    const arr = safeParseFilters(variation?.filters);
    if (!arr || arr.length === 0) return false;

    // Build present map: groupSlug -> Set(values present on this variation)
    const present = new Map();
    for (const f of arr) {
      if (!f || !f.key) continue;
      const g = slugifyKey(String(f.key));
      const val = String(f.value ?? "");
      if (!val) continue;
      if (!present.has(g)) present.set(g, new Set());
      present.get(g).add(val);
    }

    // AND across groups: each selected group must be satisfied by at least one of its values (OR)
    for (const [gSlug, wantedSet] of selectedDynamicFilters.entries()) {
      const have = present.get(gSlug);
      if (!have) return false;
      let ok = false;
      for (const val of wantedSet) {
        if (have.has(val)) {
          ok = true;
          break;
        }
      }
      if (!ok) return false;
    }
    return true;
  };

  // --------- FORMAT & APPLY FILTERS AT VARIATION LEVEL ----------
  const formattedProducts = useMemo(() => {
    return categoryFilteredProducts.flatMap((product) => {
      const variations = Array.isArray(product.variation)
        ? product.variation
        : [];

      // if no variations
      if (variations.length === 0) {
        // when dynamic filters are active, exclude base-only items
        if (hasDynamicSelections) return [];
        return {
          id: product.id,
          image: product.image,
          image_url: product.image_url,
          title: product.title,
          price: product.offer_price || 0,
          category_name:
            product.product_category?.sub_category?.parent_category
              ?.category_name || "",
          variation: null,
          made_in: product.made_in,
          stock: product.stock,
          sku: product.sku_code || "",
        };
      }

      // keep only variations that match the dynamic selections
      const matchingVariations = variations.filter(variationMatchesDynamic);
      if (matchingVariations.length === 0) return [];

      return matchingVariations.map((variation) => {
        const features = variation.features || [];
        const featureText = features.map((f) => f.feature_value).join(", ");

        let title = product.title;
        if (featureText) title += ` (${featureText})`;
        if (variation.variation_name) title += ` - ${variation.variation_name}`;

        return {
          id: product.id,
          variationId: variation.id,
          variation_name: variation.variation_name,
          variation_value: variation.variation_value,
          image: variation.image || product.image,
          image_url: variation.image_url || product.image_url,
          title: title.trim(),
          stock: variation.stock || 0,
          sku: variation.sku_code || "",
          price:
            variation.offer_price > 0
              ? variation.offer_price
              : variation.regular_price,
          category_name:
            product.product_category?.sub_category?.parent_category
              ?.category_name || "",
          variation: variation,
          made_in: variation.made_in || product.made_in,
        };
      });
    });
  }, [categoryFilteredProducts, hasDynamicSelections, selectedDynamicFilters]);

  // --------- PRICE & MADE-IN-USA FILTERS ----------
  const priceFilteredProducts = useMemo(() => {
    return formattedProducts.filter((product) => {
      const productPrice = product.price || 0;
      const madeInUsa = (product?.made_in || "").toLowerCase().includes("usa");

      // NOTE: Keeping your existing logic:
      // if isMadeUsa is true -> show NON-USA products
      if (isMadeUsa) {
        return !madeInUsa;
      }

      return productPrice >= minPrice && productPrice <= maxPrice;
    });
  }, [formattedProducts, minPrice, maxPrice, isMadeUsa]);

  // --------- SORT ----------
  const sortedProducts = useMemo(() => {
    const productsCopy = [...priceFilteredProducts];
    switch (sortOption) {
      case "Newest":
        return productsCopy.reverse();
      case "Price: Low to High":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return productsCopy.sort((a, b) => b.price - a.price);
      default:
        return productsCopy;
    }
  }, [priceFilteredProducts, sortOption]);

  // --------- PAGINATION (by base product id) ----------
  const [uniqueProductIds, totalVariations] = useMemo(() => {
    const ids = [...new Set(sortedProducts.map((p) => p.id))];
    return [ids, sortedProducts.length];
  }, [sortedProducts]);

  const totalItems = uniqueProductIds.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProductIds = uniqueProductIds.slice(startIndex, endIndex);
  const currentItems = sortedProducts.filter((p) =>
    currentPageProductIds.includes(p.id)
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setTotalProducts(uniqueProductIds.length);
    setCurrentPage(1);
  }, [uniqueProductIds]);

  return (
    <>
      {singleCategory && (
        <Helmet>
          <title>
            {`${singleCategory?.category_name} Products`}
            {isMadeUsa ? " (Non-USA)" : ""}
            {currentPage > 1 ? ` - Page ${currentPage}` : ""}
            {` | ${import.meta.env.VITE_SITE_NAME}`}
          </title>

          <meta
            name="description"
            content={
              `Browse ${totalItems} ${
                singleCategory?.category_name
                  ? singleCategory.category_name.toLowerCase()
                  : ""
              } products` +
              `${isMadeUsa ? " not made in USA" : ""}` +
              `${sortOption === "Newest" ? ", newest arrivals" : ""}` +
              `${
                minPrice || maxPrice ? ` ($${minPrice} - $${maxPrice})` : ""
              }` +
              `. ${
                currentPage > 1 ? `Page ${currentPage} of ${totalPages}.` : ""
              }`
            }
          />

          <link
            rel="canonical"
            href={`${import.meta.env.VITE_CLIENT_URL}/products${
              singleCategory?.slug ? `/${singleCategory.slug}` : ""
            }`}
          />

          <meta
            property="og:title"
            content={`${singleCategory?.category_name || "All"} Products`}
          />
          <meta
            property="og:description"
            content={`Browse our collection of ${
              singleCategory?.category_name || "all"
            } products`}
          />
          <meta
            property="og:url"
            content={`${import.meta.env.VITE_CLIENT_URL}/products${
              singleCategory?.slug ? `/${singleCategory.slug}` : ""
            }`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={bgImage} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={`${singleCategory?.category_name || "All"} Products`}
          />
          <meta
            name="twitter:description"
            content={`Browse our collection of ${
              singleCategory?.category_name || "all"
            } products`}
          />
          <meta name="twitter:image" content={bgImage} />

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${singleCategory?.category_name || "All"} Products`,
              description: `Browse our collection of ${
                singleCategory?.category_name || "all"
              } products`,
              url: `${import.meta.env.VITE_CLIENT_URL}/products${
                singleCategory?.slug ? `/${singleCategory.slug}` : ""
              }`,
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: `${import.meta.env.VITE_CLIENT_URL}/`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Products",
                    item: `${import.meta.env.VITE_CLIENT_URL}/products`,
                  },
                  ...(singleCategory?.category_name
                    ? [
                        {
                          "@type": "ListItem",
                          position: 3,
                          name: singleCategory.category_name,
                          item: `${import.meta.env.VITE_CLIENT_URL}/products/${
                            singleCategory.slug
                          }`,
                        },
                      ]
                    : []),
                ],
              },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: currentItems
                  .slice(0, 5)
                  .map((product, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                      "@type": "Product",
                      name: product.title,
                      image: product.image,
                      description: product.title,
                      offers: {
                        "@type": "Offer",
                        price: product.price,
                        priceCurrency: "USD",
                      },
                    },
                  })),
              },
            })}
          </script>
        </Helmet>
      )}

      <section className="w-full border-y-2 border-blue-950/10">
        <div className="max-w-7xl mx-auto px-6 md:px-4 py-2">
          {/* Breadcrumb */}
          <nav className="text-sm md:text-base flex items-center gap-2 text-gray-500">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-600">
              {singleCategory
                ? singleCategory.category_name
                : breadcrumb?.item?.title || "Products"}
            </span>
          </nav>

          {/* Title */}
          <h1 className="mt-0 text-xl md:text-2xl font-bold text-gray-900">
            {singleCategory
              ? singleCategory.category_name
              : breadcrumb?.item?.title || "Products"}
          </h1>
        </div>
      </section>

      <div className="w-full max-w-[1310px] mx-auto mt-3 md:mt-8 flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* Desktop Filter Section */}
        <div className="hidden lg:block w-64">
          {/* pass products so the sidebar can build groups */}
          <Filter products={products} />
        </div>

        {/* Main Content Section */}
        <div className="w-full flex flex-col">
          {/* Desktop: info row */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h1 className="text-[#182B55] font-medium text-lg">
              Showing {totalItems} product ({totalVariations} options)
            </h1>

            <div className="flex items-center gap-4">
              {/* Wishlist */}
              <Link
                to={"/wish-list"}
                className="bg-[#F8F9FB] border-2 border-[#ECF0F9] rounded-[42px] w-24 h-10 py-3 px-5 flex items-center justify-around"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clipPath="url(#clip0_448_4569)">
                    <path
                      d="M14.5796 1.59766C13.6412 1.61225 12.7233 1.8742 11.9185 2.35705C11.1138 2.8399 10.4507 3.52655 9.99622 4.34766C9.54175 3.52655 8.87867 2.8399 8.07392 2.35705C7.26917 1.8742 6.35126 1.61225 5.41289 1.59766C3.91701 1.66265 2.50764 2.31703 1.49271 3.41785C0.477771 4.51867 -0.060237 5.97643 -0.00377825 7.47266C-0.00377825 11.2618 3.98456 15.4002 7.32956 18.206C8.0764 18.8336 9.02068 19.1777 9.99622 19.1777C10.9718 19.1777 11.916 18.8336 12.6629 18.206C16.0079 15.4002 19.9962 11.2618 19.9962 7.47266C20.0527 5.97643 19.5147 4.51867 18.4997 3.41785C17.4848 2.31703 16.0754 1.66265 14.5796 1.59766Z"
                      fill="#EE2738"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_448_4569">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <h2 className="text-[#182B55] font-medium text-xl leading-6">
                  {wishlistItems.length}
                </h2>
              </Link>

              {/* Sort */}
              <div className="relative flex-1 max-w-[200px]">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full appearance-none bg-[#F8F9FB] border-1 border-[#F8F9FB] hover:border-gray-400 rounded-[42px] px-6 py-3 pr-8 text-md leading-4 font-medium text-[#182B55] focus:outline-none transition-all duration-300"
                >
                  <option>Relevance</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-blue-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: filter + sort + wishlist */}
          <div className="w-full flex flex-col gap-4 lg:hidden">
            <div className="w-full flex items-center justify-between">
              <button
                className="bg-[#F8F9FB] border border-[#F8F9FB] rounded-[42px] px-4 py-2 text-sm leading-4 font-medium text-[#182B55] inline-flex gap-2 cursor-pointer"
                onClick={() => setShowFilter(!showFilter)}
              >
                <IoFilterSharp /> <span>Filter</span>
              </button>

              <div className="w-full flex items-center justify-around">
                <div className="max-w-[200px] relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full appearance-none bg-[#F8F9FB] border border-[#F8F9FB] rounded-[42px] px-4 py-2 text-sm leading-4 font-medium text-[#182B55] focus:outline-none"
                  >
                    <option>Relevance</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-4">
                    <svg
                      className="w-4 h-4 text-blue-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <Link
                  to="/wish-list"
                  className="bg-[#F8F9FB] border-2 border-[#ECF0F9] rounded-[42px] py-1 px-4 flex gap-2 items-center justify-around"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_448_4569)">
                      <path
                        d="M14.5796 1.59766C13.6412 1.61225 12.7233 1.8742 11.9185 2.35705C11.1138 2.8399 10.4507 3.52655 9.99622 4.34766C9.54175 3.52655 8.87867 2.8399 8.07392 2.35705C7.26917 1.8742 6.35126 1.61225 5.41289 1.59766C3.91701 1.66265 2.50764 2.31703 1.49271 3.41785C0.477771 4.51867 -0.060237 5.97643 -0.00377825 7.47266C-0.00377825 11.2618 3.98456 15.4002 7.32956 18.206C8.0764 18.8336 9.02068 19.1777 9.99622 19.1777C10.9718 19.1777 11.916 18.8336 12.6629 18.206C16.0079 15.4002 19.9962 11.2618 19.9962 7.47266C20.0527 5.97643 19.5147 4.51867 18.4997 3.41785C17.4848 2.31703 16.0754 1.66265 14.5796 1.59766Z"
                        fill="#EE2738"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_448_4569">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <h2 className="text-[#182B55] font-medium text-sm">
                    {wishlistItems.length}
                  </h2>
                </Link>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex justify-center flex-wrap gap-6">
            {loading ? (
              <div className="w-full flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : currentItems.length > 0 ? (
              Object.values(
                currentItems.reduce((acc, product) => {
                  const baseProductId = product.id;
                  if (!acc[baseProductId]) {
                    acc[baseProductId] = {
                      baseProduct: product,
                      variations: [],
                    };
                  }
                  if (product.variationId) {
                    acc[baseProductId].variations.push(product);
                  } else {
                    acc[baseProductId].baseProduct = product;
                  }
                  return acc;
                }, {})
              ).map(({ baseProduct, variations }) => {
                const allVariations = [baseProduct, ...variations];
                const displayProduct =
                  variations.length > 0 ? variations[0] : baseProduct;

                return (
                  <ProductCard
                    dropdownRef={
                      openVariationId === displayProduct.variationId
                        ? dropdownRef
                        : null
                    }
                    key={`${displayProduct.id}-${
                      displayProduct.variationId || "base"
                    }`}
                    productId={displayProduct.id}
                    variationId={displayProduct.variationId}
                    variation_name={displayProduct.variation_name}
                    variation_value={displayProduct.variation_value}
                    sku_code={displayProduct.sku}
                    category={displayProduct.category_name}
                    title={displayProduct.title}
                    image={displayProduct.image?.id}
                    image_url={displayProduct.image_url}
                    price={displayProduct.price}
                    stock={displayProduct.stock}
                    made_in={displayProduct.made_in}
                    sku={displayProduct.sku}
                    variation={displayProduct.variation}
                    length={allVariations.length}
                    allVariations={allVariations}
                    isOpen={openVariationId === displayProduct.variationId}
                    onToggle={() =>
                      handleToggleVariations(displayProduct.variationId)
                    }
                  />
                );
              })
            ) : (
              <div className="w-full text-center py-20">
                <h3 className="text-xl font-medium text-gray-600">
                  No products found matching your criteria
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters or search term
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Mobile filter overlay */}
        {showFilter && (
          <div className="lg:hidden fixed bg-white/5 shadow-sm backdrop-blur-xs left-0 top-0 h-screen w-full z-50">
            <div
              className="absolute left-0 top-0 h-screen w-full z-[-1] transform transition-transform duration-300 ease-in-out bg-white/5"
              onClick={() => setShowFilter(false)}
            />
            <div className="absolute right-0 top-0 h-screen w-[82%] max-w-[360px] bg-white shadow-xl px-3 py-4">
              <Filter
                onClose={() => setShowFilter(false)}
                products={products}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Category;
