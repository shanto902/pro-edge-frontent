import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useProductContext } from "../../../../context/ProductContext";
import logo from "../../../../assets/ProEdgeLogo.png";
import { useContext } from "react";
import { CartContext } from "../../../../context/CartContext";
import cartIcon from "../../../../assets/icons/cart.svg";
import DesktopNav from "./mainNav/MainNavDesktop";

const MainNav = () => {
  const { cartItems } = useContext(CartContext);
  const { searchTerm, setSearchTerm } = useProductContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access_token");

  const actionIcons = [
    { path: "/cart", icon: cartIcon, alt: "Cart", count: cartItems.length },
  ];

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/products", text: "Products" },
    { to: "/videos", text: "Videos" },
    { to: "/tech-help", text: "TechHelp" },
    { to: "/contact-us", text: "Contact" },
  ];

  const userMenuItems = [
    {
      icon: <FiUser className="w-5 h-5" />,
      text: "My Profile",
      action: () => navigate("/profile"),
    },
    {
      icon: <FiLogOut className="w-5 h-5" />,
      text: "Sign Out",
      action: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/auth/signin");
        setIsOpen(false);
      },
    },
  ];

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    navigate("/products");
  };

  return (
    <>
      {/* Main Navigation */}
      <nav
        className="bg-[#182B55] text-white sticky top-0 z-40"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logo}
              alt="ProEdge Logo"
              className="h-6 md:h-8 w-auto"
              loading="lazy"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-2">
            <DesktopNav actionIcons={actionIcons} />
          </div>

          {/* Mobile Nav Trigger */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-[#23366B] hover:bg-[#1A2A55] transition-colors"
              aria-label="Menu"
            >
              {isOpen ? (
                <FiX className="w-5 h-5 text-white" />
              ) : (
                <FiMenu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay - OUTSIDE NAV */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#182B55]/95 backdrop-blur-sm">
          <div className="relative h-full w-full flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>

            {/* User Profile */}
            {storedUser && token && (
              <div className="absolute top-6 left-6" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-white"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {storedUser.first_name?.charAt(0)}
                    {storedUser.last_name?.charAt(0)}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {storedUser.first_name} {storedUser.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {storedUser.email}
                      </p>
                    </div>
                    {userMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setIsUserMenuOpen(false);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        {item.icon}
                        {item.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search Bar */}
            <div className="flex-1 flex flex-col items-center  justify-center px-6 pt-16">
              <form
                className="w-full max-w-md mb-8 relative"
                onSubmit={handleSearch}
                ref={searchRef}
              >
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 pl-12 pr-6 rounded-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  >
                    <FiSearch className="w-5 h-5 text-white" />
                  </button>
                </div>
              </form>

              {/* Navigation Links */}
              <nav className="w-full max-w-md space-y-4">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className="block py-3 px-6 text-white hover:bg-white/10 rounded-full transition-colors text-center text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
              </nav>

              {/* Auth Buttons */}
              {!storedUser && !token && (
                <div className="mt-8 flex gap-4">
                  <Link
                    to="/auth/signin"
                    className="px-6 py-2 bg-white text-[#182B55] rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Footer with Cart & Fav Icons */}
            <div className="pb-8 flex flex-col items-center">
              <div className="flex gap-4 mb-4">
                {actionIcons.map((icon, index) => (
                  <Link
                    key={index}
                    to={icon.path}
                    title={icon.alt}
                    aria-label={icon.alt}
                    className="relative w-12 h-12 flex justify-center items-center rounded-full bg-[#23366B] hover:bg-[#1A2A55] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {icon.count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-sm font-bold px-1.5 py-[1px] rounded-full min-w-[18px] text-center leading-none">
                        {icon.count > 99 ? "99+" : icon.count}
                      </span>
                    )}
                    {icon.icon === "cart" ? (
                      <FiShoppingCart className="w-6 h-6 text-white" />
                    ) : icon.icon === "heart" ? (
                      <FiHeart className="w-6 h-6 text-white" />
                    ) : (
                      <img src={icon.icon} alt={icon.alt} className="w-6 h-6" />
                    )}
                  </Link>
                ))}
              </div>
              <p className="text-center text-gray-300 text-sm">
                © {new Date().getFullYear()} ProEdge Tools
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNav;
