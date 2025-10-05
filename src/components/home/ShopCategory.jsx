import React, { useContext, useMemo, useRef, useEffect } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { useNavigate } from "react-router-dom";
import { formatCategoryName } from "../../helper/slugifier/slugify";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const CategoryItem = React.memo(({ id, image, label, alt, category_name }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center group min-w-[140px]">
      <div
        className="relative w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-white p-2 mb-3"
        onClick={() =>
          navigate(
            `/products?parent_category=${formatCategoryName(
              category_name + " " + id
            )}`
          )
        }
      >
        <img
          src={`${import.meta.env.VITE_SERVER_URL}/assets/${image}`}
          alt={alt}
          className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          onClick={() =>
            navigate(
              `/products?parent_category=${formatCategoryName(
                category_name + " " + id
              )}`
            )
          }
          className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-[#3F66BCAB] rounded-full transition-opacity cursor-pointer"
        >
          <span className="text-md md:text-lg font-semibold text-white">
            Shop All
          </span>
        </div>
      </div>
      <span className="w-full text-sm md:text-md lg:text-base leading-tight text-white text-center">
        {label}
      </span>
    </div>
  );
});

const ShopCategorySection = () => {
  const { categories } = useContext(CategoryContext);
  const swiperRef = useRef(null);

  // Memoize swiper slides to prevent re-renders
  const swiperSlides = useMemo(() => (
    categories.map((category) => (
      <SwiperSlide key={category.id}>
        <CategoryItem
          id={category.id}
          image={category.image.id}
          label={category.category_name}
          alt={category.category_name}
          category_name={category.category_name}
        />
      </SwiperSlide>
    ))
  ), [categories]);

  const sliderNeeded = categories.length > 6;

  return (
    <section aria-labelledby="shop-category-heading" className="overflow-hidden">
      <div className="bg-[#182B55] py-20 md:py-28 text-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold">
          Shop by Category
        </h1>
      </div>

      <div className="bg-[#3F66BC] py-20 md:py-28 relative">
        <div className="w-full max-w-7xl absolute bottom-4 md:bottom-12 md:left-1/2 md:-translate-x-1/2 px-6">
          <div
            onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
            onMouseLeave={() => swiperRef.current?.autoplay?.start()}
          >
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              slidesPerView={2}
              spaceBetween={24}
              loop={sliderNeeded}
              autoplay={
                sliderNeeded
                  ? {
                      delay: 3000,
                      disableOnInteraction: false,
                    }
                  : false
              }
              pagination={
                sliderNeeded
                  ? {
                      clickable: true,
                      el: ".shop-cat-desktop-pagination",
                    }
                  : false
              }
              watchOverflow={true}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 7 },
              }}
              modules={[Autoplay, Pagination]}
              className="w-full"
            >
              {swiperSlides}
            </Swiper>

            <div className="h-2 mt-8"></div>

            {sliderNeeded && (
              <div className="shop-cat-desktop-pagination flex justify-center space-x-2" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ShopCategorySection);