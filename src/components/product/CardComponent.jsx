import React from 'react';
import IconComponent from '../common/utils/ProductDetails/IconComponent';
import HeadingComponent from '../common/utils/ProductDetails/HeadingComponent';

const CardComponent = ({icon,title,subtitle}) => {
  return (
    <div className="w-full sm:w-[384px] bg-white py-6 px-5 shadow-sm rounded-[12px] flex items-center justify-evenly">
      <IconComponent icon={icon} />
      <HeadingComponent title={title} subtitle={subtitle} />
    </div>
  );
};

export default CardComponent;
