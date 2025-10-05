// Reusable Input Field Component
const InputField = ({
  type = "text",
  id,
  name,
  placeholder,
  required = true,
  className = "",
  fullWidth = false,
  onChange,
  value,
}) => (
  <input
    type={type}
    id={id}
    name={name}
    placeholder={placeholder}
    required={required}
    onChange={onChange}
    value={value}
    className={`bg-[#F8F9FB] border border-[#ECF0F9] rounded-[8px] px-4 py-[17px] md:w-full text-[#5D6576] placeholder-opacity-100 placeholder-[#5D6576] text-[16px] leading-[22px] focus:outline-none focus:ring-2 focus:ring-[#cfd8e6] transition duration-200 ${
      fullWidth ? "w-full" : "w-[348px]"
    } ${className}`}
  />
);

export default InputField;
