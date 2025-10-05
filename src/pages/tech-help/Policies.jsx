import { useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { fetchPageBlocks } from '../../context/PageContext';
import PageHeader from '../../components/common/utils/banner/SubPageHeader';
import { useQuery } from '@tanstack/react-query';
import { useProductContext } from '../../context/ProductContext';

const Policies = () => {
    const { pathname } = useLocation();

    const cleanPathname = pathname.replace(/\//g, '');

    const { data: blocks = [],  } = useQuery({
    queryKey: ['pageBlocks', `${cleanPathname}`],
    queryFn: () => fetchPageBlocks(`${cleanPathname}`),
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
  const {setSearchTerm}=useProductContext();


    const breadcrumb = blocks?.filter(
        (block) => block?.item?.type?.toLowerCase().trim() === "breadcrumb"
    )[0];

    const page_text = blocks?.filter(
        (block) => block?.item?.type?.toLowerCase().trim() === "page_text"
    )[0];

    function ShadowedRichText({ html }) {
        const hostRef = useRef(null);
        useEffect(() => {
            const hostEl = hostRef.current;
            if (hostEl && !hostEl.shadowRoot) {
                // Attach shadow root once and inject HTML
                const shadow = hostEl.attachShadow({ mode: 'open' });
                shadow.innerHTML = html;
            }
        }, [html]);

        return <div ref={hostRef}></div>;
    }
useEffect(() => {
    return () => {
      if (location.pathname !== "/products") setSearchTerm("");
    };
  }, []);
    return (
        <>
            <PageHeader
                title={breadcrumb?.item?.title}
                bgImage={`${import.meta.env.VITE_SERVER_URL}/assets/${breadcrumb?.item?.image?.id}`}
                breadcrumbs={[{ link: "/", label: "Home" }, { label: breadcrumb?.item?.title }]}
            />
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                        {page_text?.item?.text ? (
                            <ShadowedRichText html={page_text.item.text} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Policies;
