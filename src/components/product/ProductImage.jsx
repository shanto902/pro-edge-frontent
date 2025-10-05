import React, { useState, useEffect, useRef } from "react";

const ProductImage = ({
  thumbnails = [],
  initialMainImage,
  baseImage,
  onMainImageChange,
  selectedVariationId,
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mainImage, setMainImage] = useState(baseImage || initialMainImage);
  const imageContainerRef = useRef(null);

  /** When variation changes → set first image of that variation  */
 useEffect(() => {
  // When variation changes → reset to base image
  setMainImage(baseImage || initialMainImage);
}, [selectedVariationId, baseImage, initialMainImage]);


  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

   const handleThumbnailClick = (thumb) => {
    const imageUrl = thumb.image
      ? `${import.meta.env.VITE_SERVER_URL}/assets/${thumb.image}`
      : thumb.image_url;
    setMainImage(imageUrl);
    // setIsBaseImage(false);
    if (onMainImageChange) {
      onMainImageChange(thumb.option); // tells parent what variation this image belongs to
    }
  };

  const visibleThumbs = thumbnails.filter(
    (t) => t.id === selectedVariationId
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full p-10 lg:p-0 justify-center">
      {visibleThumbs.length > 0 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 max-h-[500px]">
          {visibleThumbs.map((thumb, index) => {
            const url = thumb.image
              ? `${import.meta.env.VITE_SERVER_URL}/assets/${thumb.image}`
              : thumb.image_url;
            return (
              <div
                key={`${thumb.id}-${url}-${index}`}
                onClick={() => handleThumbnailClick(thumb)}
                className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden transition-all ${
                  mainImage === url
                    ? "border-blue-500 shadow-md"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => (e.target.src = "")}
                />
              </div>
            );
          })}
        </div>
      )}

      <div
        ref={imageContainerRef}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        className="relative flex-1 max-w-md bg-transparent p-4 rounded-lg border border-gray-200 overflow-hidden"
      >
        <button
          onClick={() => {
            if (!imageContainerRef.current) return;
            if (document.fullscreenElement) document.exitFullscreen();
            else imageContainerRef.current.requestFullscreen();
          }}
          className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow hover:bg-gray-100"
          title="View Fullscreen"
        >
          🔍
        </button>

        <img
          src={mainImage}
          alt="Main Product"
          style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
          className={`w-full h-full object-contain transition-transform duration-200 ${
            zoomed ? "scale-200" : "scale-100"
          }`}
          onError={(e) => (e.target.src = "")}
        />

        {zoomed && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute border-2 border-blue-400 bg-transparent bg-opacity-20"
              style={{
                width: "33%",
                height: "33%",
                left: `${zoomPosition.x - 16.5}%`,
                top: `${zoomPosition.y - 16.5}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImage;
