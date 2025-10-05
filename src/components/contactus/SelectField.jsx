const SelectField = ({
  id,
  name,
  options,
  required = true,
  className = "",
  fullWidth = false,
  onChange,
  value // <-- ADD THIS
}) => (
  <select
    id={id}
    title={name}
    defaultValue=""
    value={value}
    name={name}
    onChange={onChange}
    required={required}
    className={`bg-[#F8F9FB] border border-[#ECF0F9] rounded-[8px] px-4 py-[17px] md:w-full text-[#5D6576] placeholder-opacity-100 placeholder-[#5D6576] text-[16px] leading-[22px] focus:outline-none focus:ring-2 focus:ring-[#cfd8e6] transition duration-200 ${
      fullWidth ? "w-full" : "w-[348px]"
    } ${className}`}
  >
    <option value="" disabled>
      Select a Category
    </option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default SelectField;