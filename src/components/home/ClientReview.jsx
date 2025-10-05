import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


const ReviewCard = ({
  name,
  role,
  image,
  title,
  review,
  stars = "⭐⭐⭐⭐⭐",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
   <div className="w-full min-h-[300px] max-h-[400px] rounded-[20px] border-2 border-[#F8F9FB] hover:border-[#182B55] hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between items-start p-6 mb-6">
      {/* Top Part */}
      <div className="w-full flex-1 overflow-hidden">
        <div className="flex mb-3">{stars}</div>

        {/* Title with single-line ellipsis */}
       <p
          className={`text-md md:text-xl text-[#182B55] font-medium mb-3 ${
            isExpanded ? "" : "truncate"
          }`}
          title={title}
        >
          {title}
        </p>
        {/* Review Text with expandable logic */}
        <p
          className={`text-xs md:text-base text-[#5D6576] leading-relaxed transition-all duration-200 ${
            isExpanded ? "line-clamp-none" : "line-clamp-3"
          }`}
        >
          "{review}"
        </p>

        {/* Toggle Button */}
        {review.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-[#3F66BC] hover:underline"
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="flex gap-3 md:gap-4 items-center mt-6 w-full">
        <img
          src={image}
          alt={name}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex flex-col">
          <h3 className="text-[#182B55] text-sm font-medium">{name}</h3>
          <h5 className="text-xs text-[#4A5A7E]">{role}</h5>
        </div>
      </div>
    </div>
  );
};


// ✅ Updated GraphQL query
const REVIEWS_QUERY = `
  query {
    reviews {
      id
      name
      title
      rating
      description
      designation
      gender
      image {
        id
      }
      review_group {
        id
        base_title
        base_review
      }
    }
  }
`;

const ClientReview = ({
  buttonText = "See All Review",
  buttonLink = "#",
}) => {
  const [reviews, setReviews] = useState([]);
  const [groupTitle, setGroupTitle] = useState("Client Reviews");
  const [groupDescription, setGroupDescription] = useState("");

  const swiperRef = useRef(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch(`${import.meta.env.VITE_SERVER_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: REVIEWS_QUERY }),
    })
      .then((res) => res.json())
      .then((result) => {
        const fetched = result.data.reviews || [];
        if (fetched.length > 0) {
          const group = fetched[0].review_group;
          setGroupTitle(group?.base_title || "Client Reviews");
          setGroupDescription(group?.base_review || "");

         const formatted = fetched.map((item) => {
  const hasImage = item.image?.id;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  // Gender-based fallback avatar icons (Flaticon or similar)
  const genderAvatar = {
    male: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // male avatar
    female: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png", // female avatar
    other: "https://cdn-icons-png.flaticon.com/512/456/456212.png",    // default/neutral
  };

  const image = hasImage
    ? `${baseUrl}/assets/${item.image.id}`
    : genderAvatar[item.gender?.toLowerCase()] || genderAvatar.other;

  return {
    name: item.name,
    title: item.title,
    review: item.description,
    stars: "⭐".repeat(Number(item.rating)),
    image,
    gender: item.gender,
    role: item.designation,
  };
});

setReviews(formatted);
        }
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
      });
  }, []);

  const handleMouseEnter = () => swiperRef.current?.autoplay?.stop();
  const handleMouseLeave = () => swiperRef.current?.autoplay?.start();
  const handleTouchStart = () => swiperRef.current?.autoplay?.stop();
  const handleTouchEnd = () => swiperRef.current?.autoplay?.start();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 my-10">
      <div className="flex flex-col lg:flex-row justify-between my-12">
          <div className="w-full lg:w-xs h-[266px] flex flex-col justify-between items-start mb-8 lg:mb-0 lg:mr-[84px]">
          <div>
            <h1 className="font-semibold text-[32px] leading-10">{groupTitle}</h1>
            <p className="text-[#5D6576] font-normal text-[16px] leading-[26px]">
              {groupDescription}
            </p>
          </div>
          <a href={buttonLink}>
            <button className="bg-[#3F66BC] text-white rounded-4xl py-3 px-8 font-medium text-[16px] leading-6 hover:bg-[#0F1F40] transition-colors cursor-pointer">
              {buttonText}
            </button>
          </a>
        </div>

        <div
          className="w-full lg:w-[70%]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {reviews.length > 0 && (
            <>
              <Swiper
                slidesPerView={2}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  500: { slidesPerView: 2 },
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 2 },
                  1280: { slidesPerView: 2 },
                }}
                spaceBetween={20}
                loop={true}
                speed={700}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  el: ".review-pagination",
                  bulletClass: "review-bullet",
                  bulletActiveClass: "review-bullet-active",
                }}
                modules={[Pagination, Autoplay]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
              >
                {reviews.map((review, index) => (
                  <SwiperSlide key={index}>
                    <ReviewCard {...review} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="review-pagination flex justify-center mt-4 gap-2"></div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .review-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          border-radius: 9999px;
          transition: background 0.3s;
        }
        .review-bullet-active {
          background: #3F66BC;
        }
      `}</style>
    </section>
  );
};

export default ClientReview;
