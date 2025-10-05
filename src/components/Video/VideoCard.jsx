import React, { useState } from 'react';

const getYouTubeID = (url) => {
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const VideoCard = ({ title, link }) => {
  const [isOpen, setIsOpen] = useState(false);
  const videoId = getYouTubeID(link);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div
        onClick={openModal}
        className="w-[384px] h-[343px] bg-[#F8F9FB] hover:shadow-md rounded-xl relative cursor-pointer transition-all"
      >
        <img
          src={thumbnail}
          alt="Video Thumbnail"
          className="w-full h-[211px] rounded-t-xl object-cover"
        />
        <div className="px-4 pt-4 pb-5 flex flex-col gap-2">
          <h3 className="text-[#3F66BC] text-[16px] leading-6">Pro Edge</h3>
          <h2 className="text-[#182B55] font-medium text-xl leading-[30px]">
            {title}
          </h2>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-xl"
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white text-2xl font-bold bg-black/50 px-3 py-1 rounded-full hover:bg-black/80"
              aria-label="Close Video"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
