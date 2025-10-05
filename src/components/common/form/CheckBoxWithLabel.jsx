import React from 'react'

const CheckboxWithLabel = ({ id, name, label }) => {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" className="cursor-pointer" id={id} name={name} />
      <label htmlFor={id} className="text-[#182B55] ">{label}</label>
    </div>
  )
}

export default CheckboxWithLabel
