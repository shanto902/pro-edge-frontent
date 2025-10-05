import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFaqContext } from "../../context/FaqContext";
import PageHeader from "../../components/common/utils/banner/SubPageHeader";
import bgImage from "../../assets/images/cart.png";
import { formatCategoryName } from "../../helper/slugifier/slugify";
import FaqItem from "../../components/TechHelp/FAQItem";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

const FAQPage = () => {
  const { faqSections, loading, error } = useFaqContext();
  //   const { sectionTitle, questionTitle } = useParams();
  const routeParam = useParams();
  const sectionTitle = routeParam["section-title"];
  const questionTitle = routeParam["title"];
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Find matching section and question
  const { matchedSection, matchedQuestion } = useMemo(() => {
    if (!faqSections || faqSections.length === 0) return {};

    const section = faqSections.find(
      (s) => formatCategoryName(s.section_title) === sectionTitle
    );

    if (!section) return {};

    const question = section.faqs?.find(
      (q) => formatCategoryName(q.question) === questionTitle
    );

    return {
      matchedSection: section,
      matchedQuestion: question,
    };
  }, [faqSections, sectionTitle, questionTitle]);

  // Scroll to matched question on load
  useEffect(() => {
    if (matchedQuestion) {
      const element = document.getElementById(`faq-${formatCategoryName(matchedQuestion?.question)}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setActiveQuestion(formatCategoryName(matchedQuestion?.question));
      }
    }
  }, [matchedQuestion]);

  // Filter questions based on search
  const filteredQuestions = useMemo(() => {
    if (!matchedSection?.faqs) return [];
    return matchedSection.faqs.filter((faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [matchedSection, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ClipLoader color="#30079f" size={12} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-red-50 p-4 rounded-lg max-w-md w-full text-center">
          <h3 className="text-red-600 font-medium text-lg">
            Error Loading FAQs
          </h3>
          <p className="text-red-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!matchedSection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-blue-50 p-6 rounded-lg max-w-md w-full text-center">
          <h3 className="text-blue-600 font-medium text-lg">
            Section Not Found
          </h3>
          <p className="text-gray-600 mt-2">
            The FAQ section you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/tech-help")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Tech Help
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="FAQ"
        bgImage={bgImage}
        breadcrumbs={[
          { link: "/", label: "Home" },
          { link: "/tech-help", label: "Tech Help" },
          { label: matchedSection.section_title },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {matchedSection.section_title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our products and services.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search questions..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600">×</span>
                </button>
              )}
            </div>
          </div>

          {/* FAQ List */}
          <div className="divide-y divide-gray-200">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((faq, index) => (
                <FaqItem
                  key={formatCategoryName(faq.question) } // or use index if you're sure it's stable
                  id={formatCategoryName(faq.question) } // this becomes the unique ID
                  question={faq.question}
                  answer={faq.answer}
                  isActive={activeQuestion === formatCategoryName(faq.question)}
                  onToggle={(isOpen) =>
                    isOpen
                      ? setActiveQuestion(formatCategoryName(faq.question))
                      : setActiveQuestion(null)
                  }
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  {searchTerm
                    ? "No questions match your search."
                    : "No questions available in this section."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
