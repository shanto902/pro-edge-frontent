import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import find from "../../../../../assets/icons/search.svg";
import { useProductContext } from "../../../../../context/ProductContext";
import NavigationLink from "../NavigationLink";

const authLinks = [{ path: "/auth/signin", label: "Sign In" }];

const DesktopNav = ({ actionIcons }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access_token");

  const isAuthenticated = token && storedUser;
  const {searchTerm,setSearchTerm}=useProductContext();

 const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products`)
  };

  

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Search Bar */}
      <form
        role="search"
        className="flex w-full max-w-[200px] relative"
        onSubmit={handleSearchSubmit}
        ref={searchRef}
      >
        <div className="relative w-full rounded-full bg-white border border-gray-300 focus-within:border-blue-500 transition-colors">
          <input
            type="search"
            name="search"
            id="desktop-search"
            placeholder="Search products..."
            className="w-full px-4 py-2 text-gray-900 text-sm focus:outline-none rounded-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-[#182B55] text-white px-5 py-2 hover:bg-[#0F1F40] transition-colors rounded-full"
          >
            {/* Hide text on mobile, show only icon */}
            {/* <span className="hidden sm:inline lg:inline mr-1">Search</span> */}
            <img src={find} alt="Search" className="w-5 h-5" />
          </button>
        </div>
      </form>
      {/* Center Section - Navigation Links */}
      <div className="w-full md:w-auto">
        <NavigationLink />
      </div>


      {/* Rest of your component remains the same */}
      {/* Auth and Icons */}
      <div className="flex items-center gap-4 md:gap-6">
        {isAuthenticated ? (
          <div className="relative">
            {/* User Profile Dropdown */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              {/* User Avatar - Fallback to initials if no image */}
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                {storedUser.avatar ? (
                  <img
                    src={storedUser.avatar}
                    alt="User avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  `${storedUser.first_name.charAt(
                    0
                  )}${storedUser.last_name.charAt(0)}`
                )}
              </div>

              {/* User Name - Hidden on mobile, visible on desktop */}
              <span className="hidden md:inline text-white font-medium">
                {`${storedUser.first_name}`}
              </span>

              {/* Chevron Icon */}
              <svg
                className={`w-4 h-4 text-white transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-30 border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {`${storedUser.first_name} ${storedUser.last_name}`}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {storedUser.email}
                  </p>
                </div>

                {/* Menu Items */}
                <Link
                  to="/profile"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Auth Links for Unauthenticated Users */
          <div className="flex items-center gap-3 sm:gap-4">
            {authLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Link
                  to={link.path}
                  className="px-3 py-1.5 rounded-md text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  {link.label}
                </Link>
                {index < authLinks.length - 1 && (
                  <div
                    className="h-6 w-px bg-white/30"
                    aria-hidden="true"
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {actionIcons.map((icon, index) => (
            <Link
              key={index}
              to={icon.path}
              title={icon.alt}
              aria-label={icon.alt}
              className="relative w-10 h-10 flex justify-center items-center rounded-full bg-[#23366B] hover:bg-[#1A2A55] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {/* Notification Badge - Improved visibility */}
              {icon.count > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center ${
                    icon.count > 9 ? "min-w-[20px]" : "w-5 h-5"
                  }`}
                >
                  {icon.count > 99 ? "99+" : icon.count}
                </span>
              )}

              {/* Icon - Using Heroicons or similar for better consistency */}
              {icon.icon === "cart" ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              )  : icon.icon === "bell" ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              ) : (
                <img src={icon.icon} alt={icon.alt} className="w-5 h-5" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default DesktopNav;
