
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import CallIcon from "../../../../assets/icons/CallIcon";
import axios from "axios";

const NavHeader = () => {
  const [footer, setFooter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ALL_FOOTER_QUERY = `
    query {
      footer {
        phone_no
      }
    }
  `;

  const fetchFooter = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        { query: ALL_FOOTER_QUERY },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      setFooter(response.data.data.footer || []);
    } catch (error) {
      console.error("GraphQL fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      fetchFooter();
      hasFetched.current = true;
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between px-4 md:px-8 py-0 text-[#182B55]">
        {/* Left: Welcome Text */}
        <span className="text-sm md:text-base font-medium truncate">
          Welcome to Our Online Store!
        </span>

        {/* Right: FAQ + Call */}
        <div className="flex items-center gap-3">
          {/* FAQ Link */}
          <Link
            to="/tech-help"
            className="text-sm md:text-base text-[#3F66BC] hover:underline whitespace-nowrap"
          >
            FAQ?
          </Link>

          {/* Call Button */}
          <Link
            to={`tel:${footer?.phone_no}`}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-[#3F66BC] text-white hover:bg-[#182B55] transition-colors text-sm md:text-base"
            aria-label={`Call us at ${footer?.phone_no}`}
          >
            <CallIcon className="w-4 h-4 md:w-5 md:h-5" />
            {/* Number only visible on md and up */}
            <span className="hidden md:inline">{footer?.phone_no}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;

