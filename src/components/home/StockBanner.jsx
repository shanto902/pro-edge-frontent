import React from "react";
import { Link } from "react-router-dom";

const StockBanner = ({
  altText = "Warehouse storage shelves with products",
  blocks,
  loading,
  error,
}) => {

  if (loading) return <p></p>;
  if (error) return <p>Error loading content: {error.message}</p>;

  // console.log(blocks,"blocks")
  const banners = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "banner"
  );
  // console.log(banners,"banner")
  const bannerData = banners[1];
  return (
    <section className="relative h-[300px] overflow-hidden md:h-[400px] mt-10">
      {/* Background Image */}
      <img
        src={`${import.meta.env.VITE_SERVER_URL}/assets/${
          bannerData?.item.image.id
        }`}
        alt={altText}
        className="h-full w-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#F8F9FB] before:via-[#F8F9FB]/30 before:to-[#F8F9FB]/0"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-start justify-center mx-auto px-8 md:px-5 max-w-7xl ">
        <div className="relative space-y-4 text-left">
          <p className="text-[#3F66BC] text-lg font-semibold md:text-xl">
            {bannerData?.item.title}
          </p>
          <h1 className="text-[#182B55] text-4xl font-bold md:text-5xl">
            {bannerData?.item.subtitle}
          </h1>
          <Link
            to={bannerData?.item.button_url}
            className="inline-block bg-[#3F66BC] text-white rounded-full py-3 px-8 mt-5 font-medium text-lg hover:bg-[#0F1F40] transition-colors"
          >
            {bannerData?.item.button_text}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StockBanner;
