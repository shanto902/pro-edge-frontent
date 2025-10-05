import React, { useEffect } from "react";
import Hero from "../../components/home/Hero";
import FeatureHighlits from "../../components/home/FeatureHighlits";
import ServiceFeatures from "../../components/home/ServiceFeature";
import ShopCategorySection from "../../components/home/ShopCategory";
import MostViewedSection from "../../components/home/MostViewed";
import PromoBanner from "../../components/home/PromoBanner";
import ClientReviews from "../../components/home/ClientReview";
import StockBanner from "../../components/home/StockBanner";
import { fetchPageBlocks } from "../../context/PageContext";
import { useQuery } from "@tanstack/react-query";
import { useProductContext } from "../../context/ProductContext";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const {
    data: blocks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pageBlocks", "home"],
    queryFn: () => fetchPageBlocks("home"),
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
  const { setSearchTerm } = useProductContext();
  useEffect(() => {
      if (location.pathname !== "/products") setSearchTerm("");
  }, []);
  return (
    <>
     <Helmet>
        <title> ProEdge</title>
        <meta name="description" content="Welcome to ProEdge. Discover our products and services." />
      </Helmet>
      <Hero blocks={blocks} loading={isLoading} error={isError} />
      <ShopCategorySection />
      <FeatureHighlits blocks={blocks} loading={isLoading} error={isError} />
      <ServiceFeatures blocks={blocks} loading={isLoading} error={isError} />
      <MostViewedSection title={"Most Viewed Products"} />
      <PromoBanner blocks={blocks} loading={isLoading} error={isError} />
      <ClientReviews />
      <StockBanner blocks={blocks} loading={isLoading} error={isError} />
    </>
  );
};

export default Home;
