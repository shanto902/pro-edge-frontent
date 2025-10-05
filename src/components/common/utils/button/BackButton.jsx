import React from "react";
import { Link } from "react-router-dom";

const BackButton = ({ to = "/", label = "Back" }) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-[#3F66BC] border-2 border-[#ECF0F9] p-2 text-md px-3 hover:text-[#2E4A8E] transition-colors rounded-full"
    >
      <img src="/src/icons/arrow.svg" alt="Back Arrow" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default BackButton;
