import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { formatCategoryName } from "../../helper/slugifier/slugify";
import { useSearchParams } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- utils ---------------- */

const slugifyKey = (s = "") =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const safeParseFilters = (v) => {
  // Accepts array or JSON string of [{ key, value }]
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

// robust: compare by IDs, not slugs
const idFromSlug = (slug) => {
  if (!slug) return null;
  const parts = String(slug).split("-");
  return parts.length ? parts[parts.length - 1] : null; // keep as string for safe compare
};

// --- natural / numeric sort helpers ---
const parseSortNumber = (s = "") => {
  const str = String(s).toLowerCase();

  // fraction like "3/8 in npt"
  const frac = str.match(/(\d+)\s*\/\s*(\d+)/);
  if (frac) {
    const a = Number(frac[1]);
    const b = Number(frac[2] || 1);
    if (b !== 0) return a / b;
  }

  // decimal or integer like "10 micron", "0.5 μm"
  const num = str.match(/(\d+(\.\d+)?)/);
  if (num) return Number(num[1]);

  return NaN;
};

const naturalOptionSort = (a, b) => {
  const na = parseSortNumber(a);
  const nb = parseSortNumber(b);

  // If both have numeric meaning, sort numerically
  if (!Number.isNaN(na) && !Number.isNaN(nb)) {
    if (na !== nb) return na - nb;
  }

  // Fallback: locale "natural" compare for mixed strings
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

/* ---------------- small UI bits ---------------- */

const ToggleSection = ({ title, children, isOpen, setIsOpen }) => (
  <div className="w-full bg-[#F8F9FB] border-[1.5px] border-[#ECF0F9] rounded-lg p-4 text-sm text-[#182B55] font-medium space-y-4">
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center justify-between cursor-pointer select-none"
    >
      <h2 className="text-lg font-medium text-[#182B55] leading-6">{title}</h2>
      <svg
        className={`w-4 h-4 transform transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
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
    {isOpen && (
      <div className="space-y-4 pt-3 border-t-2 border-[#ECF0F9]">
        {children}
      </div>
    )}
  </div>
);

const Checkbox = ({ id, label, checked, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id={id}
      className="peer form-checkbox text-[#3F66BC]"
      checked={checked}
      onChange={onChange}
    />
    <label
      htmlFor={id}
      className="cursor-pointer peer-checked:text-[#3F66BC] text-[16px] leading-6 text-[#182B55] font-medium transition-colors"
    >
      {label}
    </label>
  </div>
);

const PriceRange = ({ isOpen }) => {
  const [activeThumb, setActiveThumb] = useState(null);
  const containerRef = useRef(null);

  const { minPrice, setMinPrice, maxPrice, setMaxPrice, maxRangeLimit } =
    useProductContext();

  useEffect(() => {
    setMaxPrice(maxRangeLimit);
  }, [maxRangeLimit, setMaxPrice]);

  const calculateValue = (clientX) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    return Math.round((percentage / 100) * maxRangeLimit);
  };

  const handleMouseMove = (e) => {
    if (!activeThumb || !containerRef.current) return;
    const newValue = calculateValue(e.clientX);
    if (activeThumb === "min") {
      setMinPrice(Math.min(newValue, maxPrice - 1));
    } else {
      setMaxPrice(Math.max(newValue, minPrice + 1));
    }
  };

  if (!isOpen) return null;

  const minPosition = (minPrice / maxRangeLimit) * 100;
  const maxPosition = (maxPrice / maxRangeLimit) * 100;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm text-[#182B55] font-medium mb-1">
            Min Price
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(
                Math.min(Math.max(0, Number(e.target.value)), maxPrice - 1)
              )
            }
            className="w-full px-3 py-2 border border-[#ECF0F9] rounded-md text-[#5D6576]"
            min={0}
            max={maxPrice - 1}
          />
        </div>
        <div className="flex items-end text-[#3F66BC]">–</div>
        <div className="flex-1">
          <label className="block text-sm text-[#182B55] font-medium mb-1">
            Max Price
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                Math.max(
                  Math.min(maxRangeLimit, Number(e.target.value)),
                  minPrice + 1
                )
              )
            }
            className="w-full px-3 py-2 border border-[#ECF0F9] rounded-md text-[#5D6576]"
            min={minPrice + 1}
            max={maxRangeLimit}
          />
        </div>
      </div>

      <div
        className="relative h-10"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setActiveThumb(null)}
        onMouseLeave={() => setActiveThumb(null)}
        onTouchMove={(e) => e.touches.length && handleMouseMove(e.touches[0])}
        onTouchEnd={() => setActiveThumb(null)}
      >
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#ECF0F9] rounded-full -translate-y-1/2" />
        <div
          className="absolute top-1/2 h-1 bg-blue-500 rounded-full -translate-y-1/2"
          style={{
            left: `${minPosition}%`,
            width: `${maxPosition - minPosition}%`,
          }}
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full top-1/2 -translate-y-1/2 cursor-pointer shadow-sm"
          style={{ left: `${minPosition}%` }}
          onMouseDown={() => setActiveThumb("min")}
          onTouchStart={() => setActiveThumb("min")}
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full top-1/2 -translate-y-1/2 cursor-pointer shadow-sm"
          style={{ left: `${maxPosition}%` }}
          onMouseDown={() => setActiveThumb("max")}
          onTouchStart={() => setActiveThumb("max")}
        />
      </div>

      <p className="text-[#5D6576] text-[16px] font-medium">
        Price: ${minPrice} – ${maxPrice}
      </p>
    </div>
  );
};

/* ---------------- main ---------------- */

const Filter = ({ onClose, products = [] }) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [openKeys, setOpenKeys] = useState({}); // { [groupKey]: boolean }
  const [expandedParentId, setExpandedParentId] = useState(null);

  const { categories, setSingleCategory } = useContext(CategoryContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const parentSlug = searchParams.get("parent_category");
  const subSlug = searchParams.get("sub_category");
  const childSlug = searchParams.get("child_category");

  const hasCategorySelected = !!(parentSlug || subSlug || childSlug);

  /* ---------- Category tree (URL-aware) ---------- */
  const formattedCategories = useMemo(() => {
    if (!categories) return [];

    const build = (cats) =>
      cats.map((category) => {
        const name =
          category.category_name ||
          category.child_category_name ||
          category.subcategory_name ||
          "";
        const slug = `${formatCategoryName(name)}-${category.id}`;
        const node = { ...category, slug, toggle: false };
        if (category.sub_category)
          node.sub_category = build(category.sub_category);
        if (category.child_category)
          node.child_category = build(category.child_category);
        return node;
      });

    const formatted = build(categories);

    return formatted.map((parent) => {
      const hasActiveSub = parent.sub_category?.some(
        (sub) =>
          sub.slug === subSlug ||
          sub.child_category?.some((child) => child.slug === childSlug)
      );

      const parentToggle = parent.slug === parentSlug || hasActiveSub;

      const subCategories = parent.sub_category?.map((sub) => {
        const hasActiveGrandchild = sub.child_category?.some(
          (child) => child.slug === childSlug
        );
        const subToggle = sub.slug === subSlug || hasActiveGrandchild;

        const childCategories = sub.child_category?.map((child) => ({
          ...child,
          toggle: child.slug === childSlug,
        }));

        return { ...sub, child_category: childCategories, toggle: subToggle };
      });

      return { ...parent, sub_category: subCategories, toggle: parentToggle };
    });
  }, [categories, parentSlug, subSlug, childSlug]);

  // keep CategoryContext.singleCategory in sync (optional)
  useEffect(() => {
    if (!formattedCategories.length) return;
    const matchedParent =
      formattedCategories.find((cat) => cat.toggle) ||
      formattedCategories.find((cat) =>
        cat.sub_category?.some((sub) => sub.toggle)
      );
    setSingleCategory(matchedParent || null);
  }, [formattedCategories, setSingleCategory]);

  const handleParentClick = (categoryId) =>
    setExpandedParentId((prev) => (prev === categoryId ? null : categoryId));

  const handleCategoryToggle = useCallback(
    (level, id, parentId = null) => {
      const next = new URLSearchParams(searchParams);

      if (level === "parent") {
        const category = formattedCategories.find((c) => c.id === id);
        if (category?.toggle) {
          next.delete("parent_category");
          next.delete("sub_category");
          next.delete("child_category");
        } else {
          next.set("parent_category", category.slug);
          next.delete("sub_category");
          next.delete("child_category");
        }
      } else if (level === "sub" && parentId) {
        const parent = formattedCategories.find((c) => c.id === parentId);
        const sub = parent?.sub_category?.find((s) => s.id === id);
        if (sub?.toggle) {
          next.delete("sub_category");
          next.delete("child_category");
        } else {
          next.set("parent_category", parent.slug);
          next.set("sub_category", sub.slug);
          next.delete("child_category");
        }
      } else if (level === "child" && parentId) {
        const parent = formattedCategories.find((c) =>
          c.sub_category?.some((s) => s.id === parentId)
        );
        const sub = parent?.sub_category?.find((s) => s.id === parentId);
        const child = sub?.child_category?.find((c) => c.id === id);

        if (child?.toggle) {
          next.delete("child_category");
        } else {
          next.set("parent_category", parent.slug);
          next.set("sub_category", sub.slug);
          next.set("child_category", child.slug);
        }
      }

      setSearchParams(next);
    },
    [formattedCategories, searchParams, setSearchParams]
  );

  /* ---------- STEP 1: Filter products by selected category (by IDs) ---------- */
  const scopedProducts = useMemo(() => {
    if (!hasCategorySelected) return [];

    const targetChildId = idFromSlug(childSlug);
    const targetSubId = idFromSlug(subSlug);
    const targetParentId = idFromSlug(parentSlug);

    return (products || []).filter((p) => {
      const childId = p?.product_category?.id;
      const subId = p?.product_category?.sub_category?.id;
      const parentId = p?.product_category?.sub_category?.parent_category?.id;

      if (targetChildId) return String(childId) === String(targetChildId);
      if (targetSubId) return String(subId) === String(targetSubId);
      if (targetParentId) return String(parentId) === String(targetParentId);
      return false;
    });
  }, [products, parentSlug, subSlug, childSlug, hasCategorySelected]);

  /* ---------- STEP 2: Build filter groups from those scoped products' variations ---------- */
  const filterDefs = useMemo(() => {
    if (!hasCategorySelected) return [];
    if (!scopedProducts.length) return [];

    const groups = new Map(); // key -> Set(values)

    for (const p of scopedProducts) {
      const variations = p?.variation || [];
      for (const v of variations) {
        const arr = safeParseFilters(v?.filters);
        for (const f of arr) {
          const k = String(f?.key || "").trim();
          const val = String(f?.value || "").trim();
          if (!k || !val) continue;
          if (!groups.has(k)) groups.set(k, new Set());
          groups.get(k).add(val);
        }
      }
    }

    return [...groups.entries()]
      .map(([key, set]) => ({
        key,
        options: [...set].sort(naturalOptionSort), // numeric-aware
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [scopedProducts, hasCategorySelected]);

  /* ---------- URL-backed selections for dynamic filters ---------- */

  const [selectedFilters, setSelectedFilters] = useState(new Map());

  const readSelectedFromParams = useCallback(() => {
    const map = new Map();
    for (const def of filterDefs) {
      const paramKey = `filter_${slugifyKey(def.key)}`;
      const raw = searchParams.get(paramKey);
      if (!raw) continue;
      const set = new Set(
        raw
          .split("|")
          .map((v) => decodeURIComponent(v))
          .filter(Boolean)
      );
      if (set.size) map.set(def.key, set);
    }
    return map;
  }, [filterDefs, searchParams]);

  useEffect(() => {
    setSelectedFilters(readSelectedFromParams());
  }, [readSelectedFromParams]);

  const isSelected = (key, option) =>
    selectedFilters.get(key)?.has(option) || false;

  const toggleAttr = (key, option) => {
    const paramKey = `filter_${slugifyKey(key)}`;
    const next = new URLSearchParams(searchParams);

    const current = new Set(selectedFilters.get(key) || []);
    if (current.has(option)) current.delete(option);
    else current.add(option);

    if (current.size === 0) next.delete(paramKey);
    else next.set(paramKey, [...current].map(encodeURIComponent).join("|"));

    setSearchParams(next);
  };

  const clearAttrGroup = (key) => {
    const paramKey = `filter_${slugifyKey(key)}`;
    const next = new URLSearchParams(searchParams);
    next.delete(paramKey);
    setSearchParams(next);
  };

  const clearAllFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("parent_category");
    next.delete("sub_category");
    next.delete("child_category");
    for (const [k] of next.entries()) {
      if (k.startsWith("filter_")) next.delete(k);
    }
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const removeFilter = useCallback(
    (type) => {
      const next = new URLSearchParams(searchParams);
      if (type === "parent_category") {
        next.delete("parent_category");
        next.delete("sub_category");
        next.delete("child_category");
      } else if (type === "sub_category") {
        next.delete("sub_category");
        next.delete("child_category");
      } else if (type === "child_category") {
        next.delete("child_category");
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const formatSlugForDisplay = useCallback((slug) => {
    if (!slug) return "";
    const parts = slug.split("-");
    parts.pop();
    return parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }, []);

  const hasAnyDynamicParams = useMemo(() => {
    for (const [k, v] of searchParams.entries()) {
      if (k.startsWith("filter_") && v) return true;
    }
    return false;
  }, [searchParams]);

  /* ---------- keep only up to 3 dynamic groups open ---------- */

  const MAX_OPEN_GROUPS = 3;

  const handleGroupOpen = useCallback(
    (key, wantOpen) => {
      setOpenKeys((prev) => {
        // seed with all known keys (previous + current def list)
        const allKeys = new Set([
          ...Object.keys(prev),
          ...filterDefs.map((d) => d.key),
        ]);

        // normalize current open state
        const normalized = {};
        for (const k of allKeys) normalized[k] = !!prev[k];

        if (!wantOpen) {
          normalized[key] = false;
          return normalized;
        }

        if (normalized[key]) return normalized; // already open

        // open requested key and keep only latest 3 open
        const currentlyOpen = [...allKeys].filter((k) => normalized[k]);

        // put the newly opened key first (most recent)
        const newOpenOrder = [key, ...currentlyOpen].filter(
          (v, i, a) => a.indexOf(v) === i
        );

        // enforce cap
        const keepOpen = newOpenOrder.slice(0, MAX_OPEN_GROUPS);

        for (const k of allKeys) {
          normalized[k] = keepOpen.includes(k);
        }
        return normalized;
      });
    },
    [filterDefs]
  );

  // Initialize open groups when filterDefs OR selections change:
  // - Prefer groups that have active selections from URL
  // - Then fill with the rest until we reach the cap
  useEffect(() => {
    setOpenKeys(() => {
      const next = {};
      const selectedFirst = filterDefs
        .filter((d) => (selectedFilters.get(d.key) || new Set()).size > 0)
        .map((d) => d.key);

      const fillOrder = [
        ...new Set([...selectedFirst, ...filterDefs.map((d) => d.key)]),
      ];
      const toOpen = fillOrder.slice(0, MAX_OPEN_GROUPS);

      for (const d of filterDefs) {
        next[d.key] = toOpen.includes(d.key);
      }
      return next;
    });
  }, [filterDefs, selectedFilters]);

  /* ---------------- render ---------------- */

  return (
    <div className="w-[282px] bg-white space-y-6 h-screen lg:h-auto overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-2xl text-[#182B55] leading-8 px-5 md:px-0 pt-5 md:pt-0">
            Filter
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden text-4xl text-[#182B55] hover:text-gray-600 px-5"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Active chips */}
      <div className="flex flex-wrap gap-2 font-medium w-full max-w-md px-1">
        {(parentSlug || subSlug || childSlug) && (
          <span className="flex items-center bg-[#F8F9FB] text-[#182B55] text-[12px] leading-[16px] px-3 py-2 rounded-[40px] max-w-full">
            <span className="truncate max-w-[160px]">
              {formatSlugForDisplay(
                parentSlug ||
                  formattedCategories.find((p) =>
                    p.sub_category?.some(
                      (s) =>
                        s.slug === subSlug ||
                        s.child_category?.some((c) => c.slug === childSlug)
                    )
                  )?.slug
              )}
            </span>
            <button
              onClick={() => removeFilter("parent_category")}
              className="ml-2 text-[#182B55] font-bold"
              aria-label="Remove parent category"
            >
              &times;
            </button>
          </span>
        )}

        {(subSlug || childSlug) && (
          <span className="flex items-center bg-[#F8F9FB] text-[#182B55] text-[12px] leading-[16px] px-3 py-2 rounded-[40px] max-w-full">
            <span className="truncate max-w-[160px]">
              {formatSlugForDisplay(
                subSlug ||
                  formattedCategories
                    .flatMap((p) => p.sub_category || [])
                    .find((s) =>
                      s.child_category?.some((c) => c.slug === childSlug)
                    )?.slug
              )}
            </span>
            <button
              onClick={() => removeFilter("sub_category")}
              className="ml-2 text-[#182B55] font-bold"
              aria-label="Remove sub category"
            >
              &times;
            </button>
          </span>
        )}

        {childSlug && (
          <span className="flex items-center bg-[#F8F9FB] text-[#182B55] text-[12px] leading-[16px] px-3 py-2 rounded-[40px] max-w-full">
            <span className="truncate max-w-[160px]">
              {formatSlugForDisplay(childSlug)}
            </span>
            <button
              onClick={() => removeFilter("child_category")}
              className="ml-2 text-[#182B55] font-bold"
              aria-label="Remove child category"
            >
              &times;
            </button>
          </span>
        )}

        {/* dynamic chips */}
        {hasCategorySelected &&
          filterDefs.flatMap((def) => {
            const sel = [...(selectedFilters.get(def.key) || [])];
            return sel.map((val) => (
              <span
                key={`${def.key}-${val}`}
                className="flex items-center bg-[#F8F9FB] text-[#182B55] text-[12px] leading-[16px] px-3 py-2 rounded-[40px] max-w-full"
              >
                <span className="truncate max-w-[180px]">
                  {def.key}: {val}
                </span>
                <button
                  onClick={() => toggleAttr(def.key, val)}
                  className="ml-2 text-[#182B55] font-bold"
                  aria-label={`Remove ${def.key} ${val}`}
                >
                  &times;
                </button>
              </span>
            ));
          })}

        {(parentSlug || subSlug || childSlug || hasAnyDynamicParams) && (
          <button
            onClick={clearAllFilters}
            className="text-[14px] leading-6 text-[#3F66BC] hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <ToggleSection
        title="Categories"
        isOpen={isCategoriesOpen}
        setIsOpen={setIsCategoriesOpen}
      >
        <div className="text-[16px] leading-5 text-[#1748b1] font-medium cursor-pointer flex flex-col gap-y-4">
          {formattedCategories.map((category) => (
            <div key={category.id} className="cursor-pointer">
              <div
                className="flex items-center"
                onClick={() => handleParentClick(category.id)}
              >
                <Checkbox
                  id={`parent-${category.id}`}
                  label={`${category.category_name} (${
                    category.total_stock || 0
                  })`}
                  checked={category.toggle}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCategoryToggle("parent", category.id);
                  }}
                />
                {category.sub_category?.length > 0 && (
                  <motion.div
                    animate={{
                      rotate: expandedParentId === category.id ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="ml-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19 9L12 16L5 9"
                        stroke="#1748b1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {expandedParentId === category.id &&
                  category.sub_category?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-6"
                    >
                      <div className="space-y-3 mt-2">
                        {category.sub_category?.map((sub) => (
                          <div key={sub.id}>
                            <Checkbox
                              id={`sub-${sub.id}`}
                              label={`${sub.subcategory_name} (${
                                sub.total_stock || 0
                              })`}
                              checked={sub.toggle}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleCategoryToggle(
                                  "sub",
                                  sub.id,
                                  category.id
                                );
                              }}
                            />
                            {sub.child_category?.length > 0 && (
                              <div className="ml-6 mt-2 space-y-2">
                                {sub.child_category?.map((child) => (
                                  <Checkbox
                                    key={child.id}
                                    id={`child-${child.id}`}
                                    label={`${child.child_category_name} (${
                                      child.total_stock || 0
                                    })`}
                                    checked={child.toggle}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleCategoryToggle(
                                        "child",
                                        child.id,
                                        sub.id
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </ToggleSection>

      {/* Dynamic attribute filters */}
      {hasCategorySelected && filterDefs.length > 0 ? (
        filterDefs.map(({ key, options }) => (
          <ToggleSection
            key={key}
            title={key}
            isOpen={!!openKeys[key]}
            setIsOpen={(open) => handleGroupOpen(key, open)} // enforce max-open logic
          >
            <div className="space-y-2">
              {options.map((opt) => (
                <Checkbox
                  key={`${key}-${opt}`}
                  id={`${slugifyKey(key)}-${slugifyKey(opt)}`}
                  label={opt}
                  checked={isSelected(key, opt)}
                  onChange={() => toggleAttr(key, opt)}
                />
              ))}
              {[...(selectedFilters.get(key) || [])].length > 0 && (
                <button
                  onClick={() => clearAttrGroup(key)}
                  className="mt-1 text-[14px] leading-6 text-[#3F66BC] hover:underline"
                >
                  Clear {key}
                </button>
              )}
            </div>
          </ToggleSection>
        ))
      ) : hasCategorySelected ? (
        <div className="text-sm text-[#5D6576] px-1">
          No attribute filters for this category.
        </div>
      ) : (
        <div className="text-sm text-[#5D6576] px-1">
          Select a category to see attribute filters.
        </div>
      )}

      {/* Price */}
      <ToggleSection
        title="Price"
        isOpen={isPriceOpen}
        setIsOpen={setIsPriceOpen}
      >
        <PriceRange isOpen={isPriceOpen} />
      </ToggleSection>
    </div>
  );
};

export default Filter;
