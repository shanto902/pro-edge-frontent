import React from "react";
import LabelInput from "../common/form/LabelInput";

const BillingAddress = ({
  values,
  onChange,
  onClear,
  sameAsShipping,
  onSameAsShippingChange,
  errors = {}
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg md:text-2xl font-semibold mb-2 text-[#182B55]">
        Billing Address
      </h2>

      {/* Same As Shipping Checkbox & Clear Button */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="sameAsShipping"
          name="sameAsShipping"
          checked={sameAsShipping}
          onChange={onSameAsShippingChange}
          className="mr-2 cursor-pointer"
        />
        <label htmlFor="sameAsShipping" className="text-sm text-gray-700">
          Same as Shipping Address
        </label>
        <button
          type="button"
          onClick={onClear}
          className="ml-auto px-4 py-2 rounded-full bg-[#FFFFFF] border-2 border-[#ECF0F9] text-sm text-[#3F66BC] hover:cursor-pointer"
        >
          Clear Address Fields
        </button>
      </div>

      {/* Billing Fields */}
      {!sameAsShipping && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelInput
            label="Full Name (First & Last Name)"
            id="billingFullname"
            name="billingFullname"
            required={true}
            value={values.billingFullname}
            onChange={onChange}
            error={errors.billingFullname}
          />
          <LabelInput
            label="Company Name (optional)"
            id="billingCompany"
            name="billingCompany"
            required={false}
            value={values.billingCompany}
            onChange={onChange}
          />
          <LabelInput
            label="Phone Number"
            id="billingPhone"
            name="billingPhone"
            type="tel"
            required={true}
            value={values.billingPhone}
            onChange={onChange}
            error={errors.billingPhone}
          />
          <LabelInput
            label="Email Address* For order confirmation"
            id="billingEmail"
            name="billingEmail"
            type="email"
            required={true}
            value={values.billingEmail}
            onChange={onChange}
            error={errors.billingEmail}
          />
        </div>
      )}

      {/* Street Address */}
      {!sameAsShipping && (
        <div className="mt-4">
          <LabelInput
            label="Street Address* No PO boxes"
            id="billingStreet"
            name="billingStreet"
            required={true}
            value={values.billingStreet}
            onChange={onChange}
            error={errors.billingStreet}
          />
        </div>
      )}

      {/* Address 2 */}
      {!sameAsShipping && (
        <div className="mt-4">
          <LabelInput
            label="Address 2 (optional) Apt., Floor, Suite, etc."
            id="billingAddress2"
            name="billingAddress2"
            required={false}
            value={values.billingAddress2}
            onChange={onChange}
          />
        </div>
      )}

      {/* City, State, ZIP */}
      {!sameAsShipping && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-4">
          <LabelInput
            className="md:col-span-3"
            label="City"
            id="billingCity"
            name="billingCity"
            required={true}
            value={values.billingCity}
            onChange={onChange}
            error={errors.billingCity}
          />
          <LabelInput
            className="md:col-span-2"
            label="State"
            id="billingState"
            name="billingState"
            required={true}
            value={values.billingState}
            onChange={onChange}
            error={errors.billingState}
          />
          <LabelInput
            className="md:col-span-2"
            label="ZIP Code"
            id="billingZip"
            name="billingZip"
            required={true}
            value={values.billingZip}
            onChange={onChange}
            error={errors.billingZip}
          />
        </div>
      )}

      {/* Purchase Order */}
      {!sameAsShipping && (
        <div className="mt-4">
          <label
            htmlFor="purchaseOrder"
            className="block font-medium text-[#182B55]"
          >
            <div className="flex justify-between">
              <span>Purchase Order # (optional)</span>
              <span className="text-[#5D6576]">
                Can contain up to 20 characters
              </span>
            </div>
          </label>
          <input
            type="text"
            id="purchaseOrder"
            name="purchaseOrder"
            value={values.purchaseOrder}
            onChange={onChange}
            maxLength={20}
            className="w-full border-2 border-[#ECF0F9] bg-[#FFFFFF] rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default BillingAddress;