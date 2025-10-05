import React from 'react';

const TextInput = ({ label, id, type = 'text', name, placeholder, value, onChange, required = false, error }) => {
  return (
    <div className="my-4">
      <label htmlFor={id} className="block text-[#182B55] text-lg font-semibold">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}        // Bind value from parent state (formData)
        onChange={onChange}  // Bind onChange handler
        placeholder={placeholder}
        required={required}
        className="w-full p-4 px-6 mt-4 border border-[#ECF0F9] rounded-4xl bg-[#F8F9FB] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}  {/* Display error message */}
    </div>
  );
};

export default TextInput;
