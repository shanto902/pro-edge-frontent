import React from 'react'
import visa from '../../assets/bankIcon/visa.svg'
import mastercard from '../../assets/bankIcon/mastercard.svg'

const CardIcons = () => {
  return (
    <div className="flex justify-start items-center gap-6 my-6">
        <img src={visa} alt="Visa Card Icon" />
        <img src={mastercard} alt="MasterCard Icon" />
    </div>
  )
}

export default CardIcons
