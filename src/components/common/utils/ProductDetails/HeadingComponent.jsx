import React from 'react';

const HeadingComponent = ({ title, subtitle }) => {
  return (
    <div className="ml-4">
      <h1 className="text-[#182B55] text-[24px] leading-8">{title}</h1>
      <h3 className="text-[#5D6576] text-[16px] leading-6">{subtitle}</h3>
    </div>
  );
};

export default HeadingComponent;
