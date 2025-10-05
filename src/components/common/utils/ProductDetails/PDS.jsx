import React from "react";

const PDS = ({ title, callBack }) => {
  return (
    <button onClick={callBack} className="border-2 py-2 px-5 rounded-md font-medium text-sm md:text-xl leading-4 md:leading-8 text-[#5D6576] border-[#ECF0F8] hover:border[#3F66BC] hover:bg-[#3F66BC] hover:text-white cursor-pointer">
      {title}
    </button>
  );
};

export default PDS;
