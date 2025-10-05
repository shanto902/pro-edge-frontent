import React, { useEffect, useState } from "react";

const DeliveryInfocard = ({ deliveryData }) => {
  const [userLocation, setUserLocation] = useState("Fetching your location...");

 

  // Get user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        setUserLocation(
          address || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
        );
      },
      (error) => {
        console.error("Geolocation error:", error);
        setUserLocation("Location access denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  const getDeliveryDate = () => {
    if (!deliveryData?.Shipping_days) return "";
    const shippingDays = parseInt(deliveryData.Shipping_days);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + shippingDays);
    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      const { city, town, village, county, state, country } =
        data.address || {};
      return [city || town || village || county, state, country]
        .filter(Boolean)
        .join(", ");
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const shippingInfo = {
    title: "Get Fast,",
    description: "Free Shipping on Orders Over $500.",
    details: "Details",
  };

  if (!deliveryData) {
    return <div>Loading delivery information...</div>;
  }

  return (
    <>
      <div className="text-sm flex flex-col space-y-2">
        <p className="text-[#182B55] font-medium">
          <span className="text-[#4A5A7E]">{shippingInfo.title}</span>
          {shippingInfo.description}
        </p>
      </div>
      <div className="flex flex-col h-[44px] gap-y-1 justify-between">
        <h1 className="text-sm leading-[18px] text-[#182B55]">
          Delivery:{" "}
          <span className="font-medium text-[#000000]">
            {getDeliveryDate()}
          </span>
        </h1>
        <div className="flex items-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 3C5.6 3 5.2 3.1 4.9 3.3C4.6 3.6 4.3 3.9 4.2 4.2C4 4.6 4 5 4 5.4C4.1 5.8 4.3 6.1 4.6 6.4C4.9 6.7 5.2 6.9 5.6 7C6 7 6.4 7 6.8 6.8C7.1 6.7 7.4 6.4 7.7 6.1C7.9 5.8 8 5.4 8 5C8 4.5 7.8 4 7.4 3.6C7 3.2 6.5 3 6 3Z"
              fill="#3F66BC"
            />
            <path
              d="M6 0C4.7 0 3.5 0.5 2.5 1.5C1.5 2.5 1 3.7 1 5C1 6.3 2 8.3 3.8 10.9C4 11.2 4.3 11.5 4.7 11.7C5.1 11.9 5.5 12 6 12C6.5 12 6.9 11.9 7.3 11.7C7.7 11.5 8 11.2 8.2 10.9C10 8.3 11 6.3 11 5C11 3.7 10.5 2.5 9.5 1.5C8.5 0.5 7.3 0 6 0Z"
              fill="#3F66BC"
            />
          </svg>
          <p className="ml-1 text-[#3F66BC] text-[10px] leading-[18px] font-medium">
            Delivering to {userLocation}
          </p>
        </div>
      </div>
    </>
  );
};

export default DeliveryInfocard;
