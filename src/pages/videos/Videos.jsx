import React, { useState, useEffect } from "react";
import SubPageHeader from "../../components/common/utils/banner/SubPageHeader";
import VideoCard from "../../components/Video/VideoCard";

import axios from "axios";
import { fetchPageBlocks } from "../../context/PageContext";
import PageHeader from "../../components/common/utils/banner/SubPageHeader";
import { useQuery } from "@tanstack/react-query";
import { useProductContext } from "../../context/ProductContext";
import { Helmet } from "react-helmet-async";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {setSearchTerm}=useProductContext();
  const { data: blocks = [] } = useQuery({
    queryKey: ["pageBlocks", "videos"],
    queryFn: () => fetchPageBlocks("videos"),
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });

  const breadcrumb = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "breadcrumb"
  )[0];
  const pageTitle = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "page_title"
  )[0];

  const ALL_VIDEOS_QUERY = `
  query {
    Videos {
      id
      title
      url
    }
  }
`;

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: ALL_VIDEOS_QUERY,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // console.log(response.data); // Log the full response to check structure

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      // Assuming the response structure is correct as `response.data.data.Videos`
      setVideos(response.data.data.Videos || []);
    } catch (error) {
      console.error("GraphQL fetch error:", error);
      setError(error.message);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

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
        bgImage={`${import.meta.env.VITE_SERVER_URL}/assets/${
          breadcrumb?.item?.image?.id
        }`}
        breadcrumbs={[
          { link: "/", label: "Home" },
          { label: breadcrumb?.item?.title },
        ]}
      />

      <section className="my-10">
        <h1 className="text-[#182B55] text-5xl leading-16 font-semibold text-center">
          {pageTitle?.item?.page_title}
        </h1>

        <div className="max-w-7xl w-full flex-center flex-wrap gap-8 mt-10 mx-auto px-4">
          {videos.map((video, index) => (
            <VideoCard key={index} title={video.title} link={video.url} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Videos;
