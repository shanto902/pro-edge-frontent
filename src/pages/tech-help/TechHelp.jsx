import React, { useEffect } from "react";
import bg from "../../assets/images/productDetails/bg.jpeg";
import greater from "../../assets/images/productDetails/greater.png";
import pick from "../../assets/images/techHelp/pick.png";
import returning from "../../assets/images/techHelp/return.png";
import history from "../../assets/images/techHelp/history.png";
import qoute from "../../assets/images/techHelp/qoute.png";
import modify from "../../assets/images/techHelp/modify.png";
import leftArrow from "../../assets/images/techHelp/leftArrow.png";
import returni from "../../assets/images/techHelp/retur.png";
import payment from "../../assets/images/techHelp/payment.png";
import term from "../../assets/images/techHelp/terms.png";
import shopping from "../../assets/images/techHelp/shopping.png";

import Icon from "../../components/TechHelp/Icon";
import FAQ from "../../components/TechHelp/FAQ";
import PolicyIcon from "../../components/TechHelp/PolicyIcon";
import PageHeader from "../../components/common/utils/banner/SubPageHeader";
import { fetchPageBlocks } from "../../context/PageContext";
import { useQuery } from "@tanstack/react-query";
import { useProductContext } from "../../context/ProductContext";
import { Helmet } from "react-helmet-async";

const TechHelp = () => {
   const { data: blocks = [],  } = useQuery({
    queryKey: ['pageBlocks', 'tech-help'],
    queryFn: () => fetchPageBlocks('tech-help'),
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
  const {setSearchTerm}=useProductContext();

  const breadcrumb = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "breadcrumb"
  )[0];
  const pageTitle = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "page_title"
  )[0];
  const helpTitle = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "page_title"
  )[1]; 
  const shippingTitle = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "page_title"
  )[2]; 
  const allpolicy = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "feature_highlight"
  );
  const features = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "tech_help_features"
  );
  // console.log("features", features);
  
  const whatToDo = [
    { image: pick, title: "Track an order", link: "/track-order" },
    { image: returning, title: "Start a return", link: "/return-order" },
    { image: history, title: "View order history", link: "/order-history" },
    { image: qoute, title: "Request a quote", link: "/contact-us" },
    {
      image: modify,
      title: "Modify or cancel an order",
      link: "/modify-order",
    },
  ];
  
  useEffect(() => {
        if (location.pathname !== "/products") setSearchTerm("");
    }, []);

  return (
    <div>
       <Helmet>
        <title> ProEdge</title>
        <meta name="description" content="Welcome to ProEdge. Discover our products and services." />
      </Helmet>
      <PageHeader
        title={breadcrumb?.item?.title}
        bgImage={
          breadcrumb?.item?.image?.id
            ? `${import.meta.env.VITE_SERVER_URL}/assets/${breadcrumb.item.image.id}`
            : undefined
        }
        breadcrumbs={[
          { link: "/", label: "Home" },
          { label: breadcrumb?.item?.title },
        ]}
      />

      <section className="my-10 max-w-7xl mx-auto">
        <h1 className="text-[#182B55] text-3xl md:text-5xl leading-tight font-semibold text-center">
          {pageTitle?.item?.page_title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 ">
          {features?.map((feature, index) => (
            <Icon
              key={feature.item.id}
              imageSrc={
                feature.item.icon?.id
                  ? `${import.meta.env.VITE_SERVER_URL}/assets/${feature.item.icon.id}`
                  : undefined
              }
              title={feature.item.title}
              link={`/${feature.item.link}`}
            />
          ))}
        </div>
      </section>

      <section className="my-20 md:my-10 max-w-7xl mx-auto">
        <h1 className="text-[#182B55] text-3xl md:text-5xl leading-tight font-semibold text-center">
          {helpTitle?.item?.page_title}
        </h1>
        <FAQ seeAllLink="see all" leftArrow={leftArrow} />
      </section>

      <section className="my-10 max-w-7xl mx-auto">
        <h1 className="text-[#182B55] text-3xl md:text-5xl leading-tight font-semibold text-center">
          {shippingTitle?.item?.page_title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {allpolicy?.map((policy) => (
            <PolicyIcon
              key={policy.item.id}
              imageSrc={
                policy.item.icon?.id
                  ? `${import.meta.env.VITE_SERVER_URL}/assets/${policy.item.icon.id}`
                  : undefined
              }
              title={policy.item.title}
              link={`/${policy.item.link}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TechHelp;
