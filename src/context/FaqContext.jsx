import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

// Create context
const FaqContext = createContext();

// Custom hook
export const useFaqContext = () => {
  const context = useContext(FaqContext);
  if (!context) {
    throw new Error("useFaqContext must be used within a FaqProvider");
  }
  return context;
};

// GraphQL query
const GET_FAQ_QUERY = `
  query {
    FAQ {
      id
      section_title
      faqs
    }
  }
`;

export const FaqProvider = ({ children }) => {
  const [faqSections, setFaqSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaqSections = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: GET_FAQ_QUERY,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const sections = response.data.data.FAQ || [];
      setFaqSections(sections);
    } catch (err) {
      console.error("GraphQL fetch error:", err);
      setError(err.message);
      setFaqSections([]);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <FaqContext.Provider
      value={{
        faqSections,
        fetchFaqSections,
        loading,
        error,
        refetch: fetchFaqSections,
      }}
    >
      {children}
    </FaqContext.Provider>
  );
};

export default FaqContext;
