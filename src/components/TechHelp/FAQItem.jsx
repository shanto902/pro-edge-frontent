import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const FaqItem = ({id, question, answer, isActive, onToggle }) => {
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  const toggleAccordion = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };

  return (
    <div 
      id={`faq-${id}`}
      className={`transition-all duration-200 ${isOpen ? "bg-blue-50" : "hover:bg-gray-50"}`}
    >
      <button
        onClick={toggleAccordion}
        className="w-full px-6 py-5 text-left focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${id}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{question}</h3>
          <span className="ml-4 text-gray-400">
            {isOpen ? (
              <FiChevronUp className="h-5 w-5" />
            ) : (
              <FiChevronDown className="h-5 w-5" />
            )}
          </span>
        </div>
      </button>
      <div
        id={`faq-content-${id}`}
        className={`px-6 pb-5 pt-0 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FaqItem;