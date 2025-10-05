import React from 'react';
import RadioOption from '../common/form/RadioOption';

const DeliveryMethod = ({ selectedMethod, onChange }) => {


  const deliveryOptions = [
    {
      id: 'standard',
      name: 'delivery_method',
      label: 'Standard Ground Shipping',
      value: 'standard',
    },
     {
      id: 'Same Day Shipping ',
      name: 'delivery_method',
      label: 'Same Day Shipping',
      value: 'Same Day Shipping',
    }
  ];

  return (
    <div className="w-full">
      <h1 className="text-[#182B55] text-xl md:text-3xl font-semibold mb-4">
        Delivery Method
      </h1>
      <div className="space-y-2">
        {deliveryOptions.map((option) => (
          <RadioOption
            key={option.id}
            id={option.id}
            name={option.name}
            label={option.label}
            checked={selectedMethod === option.value}
            onChange={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default DeliveryMethod;
