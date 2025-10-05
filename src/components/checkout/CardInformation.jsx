import React from "react";
import LabelInput from "../common/form/LabelInput";

const CardInformation = ({ onChange, values = {}, required = true }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Card Number */}
      <LabelInput
        label="Card Number"
        id="cardnumber"
        name="cardnumber"
        required={required}
        value={values.cardnumber || ""}
        onChange={onChange}
        className="md:col-span-2"
      />

      {/* Expiration Month */}
      <LabelInput
        label="Expiration Month"
        id="expmonth"
        name="expmonth"
        placeholder="Month"
        required={required}
        value={values.expmonth || ""}
        onChange={onChange}
        className="md:col-span-1"
      />

      {/* Expiration Year */}
      <LabelInput
        label="Expiration Year"
        id="expyear"
        name="expyear"
        placeholder="Year"
        required={required}
        value={values.expyear || ""}
        onChange={onChange}
        className="md:col-span-1"
      />

      {/* CVV */}
      <LabelInput
        label="Security Number"
        id="cvv"
        name="cvv"
        placeholder="CVV"
        required={required}
        value={values.cvv || ""}
        onChange={onChange}
        className="md:col-span-2"
      />

      {/* Name on Card */}
      <LabelInput
        label="Name on Card"
        id="cardname"
        name="cardname"
        required={required}
        value={values.cardname || ""}
        onChange={onChange}
        className="md:col-span-2"
      />
    </div>
  );
};

export default CardInformation;
