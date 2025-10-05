import React from "react";

const ContactInfoItem = ({ icon, title, content }) => (
  <>
    <div className="flex gap-4 items-center">
      <div className="w-12 h-12 bg-[#FFFFFF]/15 rounded-[39px] flex items-center justify-center">
        <img src={icon} alt="" className="w-7 h-7" />
      </div>
      <div>
        <h2 className="font-medium text-[16px] leading-6">{title}</h2>
        <h5 className="text-[16px] leading-5">{content}</h5>
      </div>
    </div>
    <div className="border-b-2 border-[#FFFFFF]/10 h-[1.5px]"></div>
  </>
);

export default ContactInfoItem;
