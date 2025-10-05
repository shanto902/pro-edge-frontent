import React from "react";
import { Link } from "react-router-dom";

const PolicyIcon = ({ imageSrc, title, link }) => {
  return (
    <Link to={link}>
      <div className="bg-[#F8F9FB] w-full md:max-w-sm h-38 p-6 rounded-xl hover:shadow-sm flex flex-col items-center justify-between gap-4 mx-auto mt-10">
        <img src={imageSrc} alt={title} className="w-14 h-14" />
        <h1 className="text-[#3F66BC] text-2xl leading-8 font-medium">
          {title}
        </h1>
      </div>
    </Link>
  );
};

export default PolicyIcon;
