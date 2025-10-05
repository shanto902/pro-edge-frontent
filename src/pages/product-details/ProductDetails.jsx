import { useEffect, useRef, useState } from "react";
import { useProductContext } from "../../context/ProductContext";
import { useNavigate, useParams } from "react-router-dom";
import ProductImage from "../../components/product/ProductImage";
import ProductVariation from "../../components/product/ProductVariation";
import DeliveryInfo from "../../components/product/DeliveryInfo";
import PDS from "../../components/common/utils/ProductDetails/PDS";
import ProductSpecList from "../../components/product/ProductSpecList";
import { Link } from "react-router-dom";
// import { PulseLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";
import { ClipLoader } from "react-spinners";
import { useOrderContext } from "../../context/OrderContext";
import { useQuery } from "@tanstack/react-query";
import { fetchPageBlocks } from "../../context/PageContext";

const Product = () => {
  const [singleProduct, setSingleProduct] = useState(null);
  const [singleVariation, setSingleVariation] = useState(null);
  const { fetchSettingsGraphQL } = useOrderContext();
  const navigate = useNavigate();
  const { data: blocks = [] } = useQuery({
    queryKey: ["pageBlocks", "single-product"],
    queryFn: () => fetchPageBlocks("single-product"),
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });

  const breadcrumb = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "breadcrumb"
  )[0];

  console.log(blocks);

  const [activeTab, setActiveTab] = useState("Info");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const [selectedVariationId, setSelectedVariationId] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);

  const { fetchProductById, setSearchTerm } = useProductContext();
  const { title } = useParams();

  useEffect(() => {
    if (location.pathname !== "/products") setSearchTerm("");
  }, []);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDeliveryData = async () => {
      try {
        const data = await fetchSettingsGraphQL();
        setDeliveryData(data);
      } catch (error) {
        console.error("Error fetching delivery location data:", error);
      }
    };

    fetchDeliveryData();
  }, []);

  // Extract product ID from URL
  const extractIdFromSlug = (slug) => {
    // Handle null/undefined cases
    if (!slug) return null;

    // Split by hyphens and get the last part
    const parts = slug.split("-");
    const lastPart = parts[parts.length - 1];

    // Convert to number (returns NaN if not a number)
    const id = parseInt(lastPart, 10);

    // Return null if not a valid number
    return isNaN(id) ? null : id;
  };

  const extractedVariationIdFromSlug = (slug) => {
    if (!slug) return { productId: null, variationId: null };

    const parts = slug.split("-");
    const variationId = parseInt(parts[parts.length - 2], 10);

    return isNaN(variationId) ? null : variationId;
  };

  const id = extractIdFromSlug(title);
  const variationId = extractedVariationIdFromSlug(title);

  const hasSingleProductFetched = useRef(false);

  useEffect(() => {
    if (!id || hasSingleProductFetched.current) return;
    hasSingleProductFetched.current = true;

    const fetchSingleProduct = async () => {
      try {
        const product = await fetchProductById(id);
        setSingleProduct(product);
        updateMostViewed(product);
      } catch (error) {
        console.error("Error fetching single product:", error);
      }
    };

    fetchSingleProduct();
  }, [id]);

  useEffect(() => {
    if (singleProduct?.variation?.length > 0) {
      let defaultVariation;

      if (
        variationId &&
        singleProduct.variation.some(
          (v) => String(v.id) === String(variationId)
        )
      ) {
        defaultVariation = singleProduct.variation.find(
          (v) => String(v.id) === String(variationId)
        );
      } else {
        defaultVariation = singleProduct.variation[0];
      }

      if (defaultVariation) {
        setSingleVariation(defaultVariation);
        setSelectedVariationId(defaultVariation.id);
      }
    }
  }, [singleProduct, variationId]);

  function updateMostViewed(product) {
    // 1️⃣ pull the current store (object keyed by product id).
    let store = {};
    try {
      store = JSON.parse(localStorage.getItem("mostViewed")) || {};
    } catch (err) {
      // console.log(err);
      /* corrupted JSON → start fresh */
    }

    // 2️⃣ bump the counter for this product.
    const id = String(product.id); // make sure it’s a string key
    const views = store[id]?.count ?? 0;

    store[id] = {
      ...product,
      count: views + 1, // add / increment
    };

    // 3️⃣ save it back.
    localStorage.setItem("mostViewed", JSON.stringify(store));
  }

  // const handleVariationChange = (selectedVariation) => {
  //   if (!selectedVariation) return;

  //   // Find the full variation object from the product's variations
  //   const fullVariation = singleProduct.variation.find(
  //     (v) => v.id === selectedVariation.id
  //   );

  //   if (fullVariation) {
  //     setSingleVariation(fullVariation);
  //     setSelectedVariationId(fullVariation.id);
  //   }
  // };

  if (!singleProduct || !singleVariation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-40">
        <ClipLoader color="#30079f" size={10} />
        <span className="text-blue-600 ml-2">Loading product...</span>
      </div>
    );
  }
  const breadcrumbs = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    { label: singleProduct.title },
  ];
  // const thumbnails = Array.isArray(singleProduct.variation)
  //   ? singleProduct.variation.map((v) => ({
  //       id: v.id,
  //       image_url: v.image_url || "",
  //       image: v.image?.id || "",
  //       option: v,
  //     }))
  //   : [];
  const thumbnails = Array.isArray(singleProduct.variation)
    ? singleProduct.variation.flatMap((v) =>
        (v.images || []).map((imgObj) => ({
          id: v.id,
          image_url: v.image_url || "",
          image: imgObj.image?.id || "",
          option: v,
        }))
      )
    : [];

  const defaultMainImage = singleVariation.image?.id
    ? `${import.meta.env.VITE_SERVER_URL}/assets/${singleVariation.image.id}`
    : singleVariation.image_url || "";

  const handleVariationChange = (selectedVariation) => {
    if (!selectedVariation) return;
    setSelectedVariationId(selectedVariation.id);
  

    const fullVariation = singleProduct.variation.find(
      (v) => v.id === selectedVariation.id
    );

    const slug = fullVariation.variation_name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .slice(0, 20)
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    const path = window.location.pathname;

    const lastSegment = path.split("/").pop(); 
    const parts = lastSegment.split("-");
    const productId = parts[parts.length - 1]; 

    console.log("Product ID:", productId);

    navigate(`/single-product/${slug}-${fullVariation.id}-${productId}`);

    if (fullVariation) {
      setSingleVariation(fullVariation);
      setSelectedVariationId(fullVariation.id);
    }
  };

  const baseImage = singleVariation.image?.id
    ? `${import.meta.env.VITE_SERVER_URL}/assets/${singleVariation.image.id}`
    : singleVariation.image_url || "";

  const productName = `${singleProduct.title} ${singleVariation.variation_name}`;
  const brandName = "ProEdge";
  const priceCurrency = "USD";

  // Create a more compelling meta title and description
  const metaTitle = `${productName} | ${brandName}`;
  const metaDescription = `Shop high-quality ${productName} - ${
    singleVariation.product_details?.substring(0, 140) ||
    "Industrial brass fitting for various applications"
  }`;

  // Generate canonical URL
  const cleanProductName = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const canonicalUrl = `${
    import.meta.env.VITE_CLIENT_URL
  }/products/${cleanProductName}-${id}`;

  // Generate rich product schema data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    productID: singleVariation.sku_code,
    name: productName,
    description:
      singleVariation.product_details ||
      singleVariation.product_info ||
      metaDescription,
    image: defaultMainImage,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: priceCurrency,
      price: singleVariation.offer_price,
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
        .toISOString()
        .split("T")[0], // 1 year from now
      itemCondition: "https://schema.org/NewCondition",
      availability:
        singleVariation.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: priceCurrency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: "1",
            maxValue: "2",
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: singleVariation.shipping_days - 2,
            maxValue: singleVariation.shipping_days,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: singleVariation.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: singleVariation.rating,
          reviewCount: singleVariation.total_ratings || 0,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Material",
        value: "Brass",
      },
      {
        "@type": "PropertyValue",
        name: "Country of Origin",
        value: singleVariation.made_in || "USA",
      },
      {
        "@type": "PropertyValue",
        name: "Thread Size",
        value: singleVariation.variation_value,
      },
      {
        "@type": "PropertyValue",
        name: "SKU",
        value: singleVariation.sku_code,
      },
    ],
  };

  // In your return statement, add the Helmet component at the top:
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={defaultMainImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={brandName} />
        <meta
          property="product:price:amount"
          content={singleVariation.offer_price}
        />
        <meta property="product:price:currency" content={priceCurrency} />
        <meta property="product:brand" content={brandName} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={defaultMainImage} />

        {/* Product structured data */}
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>
      {/* <PageHeader
        title={breadcrumb?.item?.title}
        bgImage={`${import.meta.env.VITE_SERVER_URL}/assets/${
          breadcrumb?.item?.image?.id
        }`}
        breadcrumbs={breadcrumbs}
      /> */}
 
      <section className="w-full border-y-2 border-blue-950/10">
        <div className="max-w-7xl mx-auto px-6 md:px-4 py-2">
          {/* Breadcrumb */}
          <nav className="text-sm md:text-base flex items-center gap-2 text-gray-500">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="text-blue-600 hover:underline">
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-600">
              {singleProduct.title}
            </span>
          </nav>

          {/* Title */}
          <h1 className="mt-0 text-xl md:text-2xl font-bold text-gray-900">
            {singleProduct.titletitle}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl w-full mx-auto mt-6">
        <section className="w-full mx-auto flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center md:justify-evenly">
          <ProductImage
            thumbnails={thumbnails}
            initialMainImage={defaultMainImage}
            baseImage={baseImage}
            onMainImageChange={handleVariationChange}
            selectedVariationId={selectedVariationId}
          />
          <ProductVariation
            title={singleProduct.title}
            sku={singleVariation.sku_code}
            rating={singleVariation.rating}
            totalRatings={singleVariation.total_ratings}
            currentPrice={singleVariation.offer_price}
            originalPrice={singleVariation.regular_price}
            productDetails={singleVariation.product_details}
            features={singleVariation.features}
            variationName={singleVariation.variation_name}
            variationValue={singleVariation.variation_value}
            priceOptions={singleProduct.variation}
            onVariationChange={handleVariationChange}
            selectedVariationId={selectedVariationId}
          />
          <DeliveryInfo
            product={singleProduct}
            productId={singleProduct.id}
            variationId={singleVariation.id}
            imageId={
              singleVariation.image?.id
                ? singleVariation.image.id
                : singleVariation.image || ""
            }
            variation_name={singleVariation.variation_name}
            offer_price={singleVariation.offer_price}
            originalPrice={singleVariation.regular_price}
            stock={singleVariation.stock}
            sku={singleVariation.sku_code}
            deliveryData={deliveryData}
          />
        </section>

        {/* Product Specifications Section */}
        <section className="my-10 max-w-7xl w-full mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Tab Header */}
          <div className="border-b border-gray-200 px-2 md:px-6 py-4 rounded-t-2xl">
            <nav className="flex space-x-0 md:space-x-8 gap-1 md:gap-4">
              <PDS
                title="Product Details"
                callBack={() => handleTabChange("Info")}
                active={activeTab === "Info"}
              />
              <PDS
                title="Specifications"
                callBack={() => handleTabChange("Features")}
                active={activeTab === "Features"}
              />
              <PDS
                title="General Product Info"
                callBack={() => handleTabChange("Details")}
                active={activeTab === "Details"}
              />
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6">
            {activeTab === "Features" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 bg-gray-50 rounded-lg">
                  <ProductSpecList features={singleVariation.features} />
                </div>
              </div>
            )}
            {activeTab === "Details" && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  {singleVariation.product_details}
                </div>
              </div>
            )}
            {activeTab === "Info" && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 text-justify">
                  {singleVariation.product_info}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Product;
