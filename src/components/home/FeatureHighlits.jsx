import React from "react";
import { Link } from "react-router-dom";

const FeatureCard = ({ title, imageSrc, alt, href = "#" }) => (
  <Link
    to={href}
    className="group relative block rounded-lg overflow-hidden hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50 h-54"
    role="article"
    aria-labelledby={title.replace(/\s+/g, "-").toLowerCase()}
  >
    <img
      src={imageSrc}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
    />
    <div className="absolute bottom-1/2 left-0 right-0 p-6 text-[#182B55] w-1/2 transform translate-y-1/2">
      <h3 id={title.replace(/\s+/g, "-").toLowerCase()} className="text-3xl font-semibold mb-2">
        {title}
      </h3>
    </div>
  </Link>
);

const FeatureHighlights = ({ blocks, loading, error }) => {
  if (loading) return <p></p>;
  if (error) return <p>Error loading content: {error.message}</p>;

  // Filter only feature_highlight type blocks
  const features = blocks?.filter(
    (block) =>
      block?.collection === "feature_highlights" &&
      block?.item?.type?.toLowerCase() === "feature_highlight"
  );

  // Build cards dynamically
  const cards = features?.map((block) => {
    const title = block.item?.title || "Untitled";
    const imageId = block.item?.icon?.id;
    const imageSrc = imageId
      ? `${import.meta.env.VITE_SERVER_URL}/assets/${imageId}`
      : "https://via.placeholder.com/300x200?text=No+Image"; 
    const alt = `Image for ${title}`;
    const href = `${block.item?.link}`; // customize your link pattern

    return { title, imageSrc, alt, href };
  });

  return (
    <section
      className="max-w-7xl w-full mx-auto py-12 grid grid-cols-1 lg:grid-cols-3 gap-6"
      aria-label="Feature Highlights"
    >
      {cards?.map((card, index) => (
        <FeatureCard key={index} {...card} />
      ))}
    </section>
  );
};

export default FeatureHighlights;
