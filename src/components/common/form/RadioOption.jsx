import React from 'react';

const RadioOption = ({ id, name, label, checked, onChange, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 p-3 bg-white rounded-md border border-[#ECF0F9] hover:border-[#3F66BC] transition-colors ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-[#3F66BC] focus:ring-[#3F66BC] border-gray-300"
      />
      <label htmlFor={id} className="text-[#182B55] cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default RadioOption;