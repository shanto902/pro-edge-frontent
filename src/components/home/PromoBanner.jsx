import {Link} from "react-router-dom"
const PromoBanner = ({ blocks, loading, error }) => {

  
    if (loading) return <p></p>;
    if (error) return <p>Error loading content: {error.message}</p>;
  
    const banners=blocks?.filter(block => block?.item?.type?.toLowerCase().trim()==="banner");
    const bannerData=banners[0];
  return (
    <section className="my-10">
      <div className="relative w-full h-[328px]">
        {/* Background Image */}
        <img src={`${import.meta.env.VITE_SERVER_URL}/assets/${bannerData.item.image?.id}`} alt="Promotional Banner" className="w-full h-full object-cover" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#151A26]/0 via-[#151A26]/50 to-[#151A26]/0"></div>

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-semibold leading-tight mb-[20px]">
            {bannerData.item.title}{" "}
          </h1>

          <p className="text-sm sm:text-base md:text-xl leading-5 font-medium mb-[20px]">
            {bannerData.item.subtitle}
          </p>

          <Link to={bannerData.item.button_url}>
            <button className="bg-white w-[158px] h-12 py-3 px-6 text-[#20386E] rounded-[40px] text-sm sm:text-base md:text-lg leading-6 mt-[20px] hover:bg-[#20386E] hover:text-white cursor-pointer transition duration-300">
              {bannerData.item.button_text}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
