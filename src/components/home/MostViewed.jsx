import { useEffect, useRef, useState } from "react";
import { useProductContext } from "../../context/ProductContext";
import ProductCard from "../common/utils/cards/ProductCard";
import defaultImage from "../../assets/default.webp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useQuery } from "@tanstack/react-query";

const MostViewedSection = ({ title }) => {
  const { fetchProducts } = useProductContext();
  const {
  data: products = [],
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
  staleTime: 1000 * 60 * 5, // optional: 5 minutes
  refetchOnWindowFocus: false, // optional
});
  const swiperRef = useRef(null);

  const getRandomProducts = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
  const hasFetched = useRef(false);

useEffect(() => {

  if (!hasFetched.current) {
    fetchProducts();
    hasFetched.current = true;
  }
}, []);


function getMostViewed(limit = 8) {
  try {
    const store = JSON.parse(localStorage.getItem("mostViewed")) || {};
    return Object.values(store)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);                   // e.g. top 5
  } catch (err) {
    // console.log(err);
    return [];
  }
}
const  mostViwedProduct=getMostViewed();

const displayedProducts = mostViwedProduct.length>0 ? mostViwedProduct:getRandomProducts(products, 8);

const getProductProps = (product) => {
  const variation = product.variation?.[0] || {};
  const imageId = variation?.image?.id || defaultImage;
  const imageUrl = variation?.image_url || defaultImage;
    return {
      productId: product.id,
      variationId: variation.id,
      variation_name: variation.variation_name,
      stock: variation.stock,
      sku: variation.sku_code,
      image: imageId,
      image_url:imageUrl,
      category:
        product.product_category?.sub_category?.parent_category
          ?.category_name ||
        product.category_name ||
        "",
      title: `${product.title}${
        variation.variation_name ? ` - ${variation.variation_name}` : ""
      }`,
      price:
        variation.offer_price > 0
          ? variation.offer_price
          : variation.regular_price,
    };
  };

  return (
    <section className="max-w-[1500px] w-full mx-auto px-4 py-10">
      <h1 className="text-[#182B55] font-semibold text-2xl md:text-5xl text-center mb-10">
        {title}
      </h1>

      {displayedProducts.length > 0 && (
        <>
          <div
            className="relative"
            onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
            onMouseLeave={() => swiperRef.current?.autoplay?.start()}
          >
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              slidesPerView={1}
              spaceBetween={16}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                el: ".most-viewed-pagination",
              }}
              modules={[Autoplay, Pagination]}
              className="w-full"
              breakpoints={{
                480: { slidesPerView: 1.5 },
                640: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 2.5, spaceBetween: 10 },
                1024: { slidesPerView: 3, spaceBetween: 10 },
                1280: { slidesPerView: 4, spaceBetween: 10 },
              }}
            >
              {displayedProducts.map((product) => (
                <SwiperSlide key={`product-${product.id}`}>
                  <div className="w-full px-1 flex justify-center gap-0"> 
                    <ProductCard {...getProductProps(product)} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="most-viewed-pagination flex justify-center mt-6 gap-2" />
          </div>
        </>
      )}

      {/* Custom Pagination Styles */}
      <style jsx>{`
        :global(.most-viewed-pagination .swiper-pagination-bullet) {
          width: 10px;
          height: 10px;
          background: rgba(24, 43, 85, 0.3);
          border-radius: 9999px;
          transition: all 0.3s;
          opacity: 1;
        }

        :global(.most-viewed-pagination .swiper-pagination-bullet-active) {
          background: #182b55;
          width: 24px;
        }

        @media (max-width: 640px) {
          :global(.most-viewed-pagination .swiper-pagination-bullet) {
            width: 8px;
            height: 8px;
          }

          :global(.most-viewed-pagination .swiper-pagination-bullet-active) {
            width: 16px;
          }
        }
      `}</style>
    </section>
  );
};

export default MostViewedSection;
