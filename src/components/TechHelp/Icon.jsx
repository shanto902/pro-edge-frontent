import React from 'react';
import { useNavigate } from 'react-router-dom';

const Icon = ({ imageSrc, title, link }) => {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate(link)}>
      <div className="bg-[#F8F9FB] w-full md:max-w-sm h-38 p-6 rounded-xl hover:shadow-sm cursor-pointer flex flex-col items-center justify-between gap-4 mx-auto mt-10">
        <img src={imageSrc} alt={title} className="w-14 h-14" />
        <h1 className="text-[#3F66BC] text-2xl leading-8 font-medium">{title}</h1>
      </div>
    </button>
  );
};

export default Icon;