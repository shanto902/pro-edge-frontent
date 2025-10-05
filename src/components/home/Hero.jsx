import React, { useRef } from "react";
import HeroImage from "../../assets/images/heroImage.png";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Hero = ({ blocks, loading, error }) => {
  const swiperRef = useRef(null);
  if (loading) return <p></p>;
  if (error) return <p>Error loading content: {error.message}</p>;

  // console.log(blocks, "blocks");
  const slides = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "slider"
  );
  // console.log(slides, "hfhf");

  const handleMouseEnter = () => {
    swiperRef.current?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.autoplay?.start();
  };

  const handleTouchStart = () => {
    swiperRef.current?.autoplay?.stop();
  };

  const handleTouchEnd = () => {
    swiperRef.current?.autoplay?.start();
  };

  return (
    <section
      className="relative max-w-7xl h-[30rem] w-full mx-auto overflow-hidden rounded-2xl mb-10 mt-2"
      aria-labelledby="hero-heading"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
        }}
        modules={[Pagination, Autoplay]}
        className="w-full"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <picture>
                <source srcSet={HeroImage} type="image/webp/png" />
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}/assets/${
                    slide.item.image?.id
                  }`}
                  className="w-full h-[30rem] object-cover aspect-[16/9] sm:aspect-[21/9] md:aspect-auto"
                  loading="lazy"
                  // height="450px"
                />
              </picture>
              <div className="bg-gray-900/60 inset-0 absolute w-full h-full"></div>
              <div className={`absolute inset-0 ${slide.bgColor}`}>
                <div className="max-w-7xl w-full mx-auto flex flex-col justify-center items-start h-full px-4 md:px-8 py-10">
                  <header>
                    <h1
                      id="hero-heading"
                      className="text-white text-md md:text-4xl font-bold max-w-[95%] sm:max-w-[80%] md:max-w-[495px]"
                    >
                      {slide.item.title}
                    </h1>
                    <p className="text-white mt-4 text-sm md:text-xl max-w-[80%]">
                      {slide.item.subtitle}
                    </p>
                  </header>
                  <Link to={slide.item.button_url} className="mt-2 md:mt-4">
                    <button className="bg-[#3F66BC] text-white px-4 py-2 sm:px-6 sm:py-4 rounded-full hover:bg-[#182B55] transition-colors text-sm md:text-lg font-medium shadow-lg hover:cursor-pointer">
                      {slide.item.button_text}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Dots */}
      <nav
        aria-label="Carousel Navigation"
        className="absolute bottom-3 sm:bottom-3 md:bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-[1]"
      >
        <div className="hero-pagination flex justify-center items-center gap-2 md:gap-3 lg:gap-4 bg-white/10 backdrop-blur-sm py-2 sm:py-2.5 px-4 sm:px-6 rounded-full shadow-md">
          {/* Swiper inserts bullets here */}
        </div>
      </nav>

      <style>{`
        .hero-bullet {
          width: 10px;
          height: 10px;
          background: #ffffff80;
          border-radius: 9999px;
          transition: background 0.3s;
        }
        .hero-bullet-active {
          background: #ffffff;
        }
      `}</style>
    </section>
  );
};

export default Hero;
