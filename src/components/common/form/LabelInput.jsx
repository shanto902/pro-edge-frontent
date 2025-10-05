import React from 'react'

const LabelInput = ({ 
  label, 
  id, 
  name, 
  type = "text", 
  required, 
  value, 
  onChange, 
  className = "",
  error,
  ...props 
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-medium text-[#010612]">
        {label}{required && '*'}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border-2 border-[#ECF0F9] bg-[#FFFFFF] rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
        {...props}
      />
       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default LabelInput;