import React from "react";

const FeatureBox = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm hover:shadow-md p-8">
    <div className="bg-blue-100 rounded-full p-4">
      <img
        src={`${import.meta.env.VITE_SERVER_URL}/assets/${icon.id}`}
        alt={title}
        className="w-10 h-10"
      />
    </div>
    <div>
      <h2 className="text-2xl font-semibold text-[#182B55]">{title}</h2>
      <p className="text-md text-[#4A5A7E]">{subtitle}</p>
    </div>
  </div>
);

const ServiceFeatures = ({ blocks, loading, error }) => {
  if (loading) return <p></p>;

  if (error) return <p>Error loading content: {error.message}</p>;

  const features = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "feature"
  );

  // console.log("blocks", blocks);

  // console.log("features", features);

  // const features = [
  //   {
  //     icon: "../../src/assets/icons/delivery.svg",
  //     title: "Free Delivery",
  //     description: "On Orders Over $500.00",
  //     alt: "Free delivery icon",
  //   },
  //   {
  //     icon: "../../src/assets/icons/support.svg",
  //     title: "Online Support",
  //     description: "Support online 24 hours",
  //     alt: "Online support icon",
  //   },
  //   {
  //     icon: "../../src/assets/icons/return.svg",
  //     title: "Easy Returns",
  //     description: "90 day refund period",
  //     alt: "Easy return icon",
  //   },
  // ];

  return (
    <section className="bg-[#F8F9FB]">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
        {features.map((feature, index) => (
          <FeatureBox key={index} {...feature.item} />
        ))}
      </div>
    </section>
  );
};

export default ServiceFeatures;
