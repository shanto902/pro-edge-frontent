import React, { useEffect } from "react";
import { useFaqContext } from "../../context/FaqContext";
import { Link } from "react-router-dom";
import { formatCategoryName } from "../../helper/slugifier/slugify";
import { ClipLoader } from "react-spinners";
import { useRef } from "react";

const FAQ = ({ seeAllLink, leftArrow }) => {
  const { faqSections, fetchFaqSections, loading, error } = useFaqContext();
   const hasFetched = useRef(false);
  useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;
  fetchFaqSections();
}, []);


  if (loading) return <ClipLoader color="#30079f" />;
  if (error) return <p>Error: {error}</p>;
  if (!faqSections) return <p>No FAQ sections available</p>;

  return (
    <div className="w-full flex flex-wrap gap-4 md:gap-8 mt-4 md:mt-10 px-2 justify-evenly">
      {faqSections.map((section) => (
        <div
          key={section.id}
          className="w-full md:max-w-sm p-1 md:p-0 h-56 rounded-xl bg-white hover:shadow-sm"
        >
          <div className="bg-[#ECF0F9] h-12 rounded-t-xl py-2 px-4 font-semibold text-[#182B55] text-lg leading-7">
            <h1>{section.section_title}</h1>
          </div>
          <div className="p-3 font-medium text-base leading-6 text-[#3F66BC] flex flex-col justify-around gap-4 h-44">
            <div className="flex flex-col gap-2">
              {(section.faqs || []).slice(0, 3).map((faq, index) => (
                <Link
                  key={index}
                  to={`/faq/${formatCategoryName(
                    section.section_title
                  )}/${formatCategoryName(faq.question)}`}
                  className="hover:underline"
                >
                  {console.log(faq.question, "faq.section_title")}
                  <h2>{faq.question}</h2>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/faq/${formatCategoryName(section.section_title)}`}
                className="hover:underline"
              >
                See All
              </Link>
              <img src={leftArrow} alt="Arrow" className="w-4 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
