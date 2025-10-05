import React, { useEffect, useRef, useState } from "react";
import logo from "../../../assets/ProEdgeLogo.png";
import { Link } from "react-router-dom";
import axios from "axios";

const Footer = () => {

  const [footer, setFooter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ALL_FOOTER_QUERY = `
  query{
    footer{
      id
      footer_title
      contact_number
      fax
      phone_no
      email
      location_title
      location_url
    }
  }
  `;
  const fetchFooter = async () => {
    setLoading(true);
    setError(null);
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: ALL_FOOTER_QUERY,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      setFooter(response.data.data.footer || []);
    } catch (error) {
      console.error("GraphQL fetch error:", error);
      setError(error.message);
      setLoading(false);
    }
    finally{
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
 
  // console.log(footer, 'fromfooter')


  const infoLinks = ["Products", "Videos", "Tech help", "Contact Us"];

  const contactInfo = [
    { label: "Text", value: footer?.contact_number, href: `sms:${footer?.phone_no}` },
    { label: "Phone", value: footer?.phone_no, href: `tel:${footer?.phone_no}` }, 
    { label: "Fax", value: footer?.fax, href: `fax:${footer?.fax}` },
    { label: "Email", value: footer?.email, href: `mailto:${footer?.email}` },
  ];
  
  return (
    <footer className="w-full h-auto bg-[#182B55] flex flex-col items-center justify-evenly py-8 px-4">
      <div className="flex flex-col lg:flex-row flex-wrap gap-4 md:gap-8 items-start justify-between w-full max-w-[1200px]">

        <div className="w-[292px] h-40 md:h-[214px] flex flex-col justify-evenly">
          <div>
            <img src={logo} alt="Logo" className="h-6 md:h-9" />
          </div>
          <div>
            <p className="text-white text-sm md:text-[16px] leading-4 md:leading-7">
              {footer?.footer_title}
            </p>
          </div>
          <div className="relative">
            <input
              type="email"
              className="text-[#5D6576] font-medium text-sm md:text-[16px] leading-6 bg-white py-1 pr-20 md:pr-28 pl-6 h-8 md:h-12 w-full rounded-[26px]"
              placeholder="Your email"
            />
            <button className="absolute top-1/2 right-1 md:right-2 transform -translate-y-1/2 bg-[#182B55] text-white py-2 px-5 rounded-4xl h-7 md:h-10 w-[100px] flex items-center justify-center hover:bg-[#0F1F40] transition-colors cursor-pointer">
              SUBMIT
            </button>
          </div>
        </div>

        <div className="w-[135px] h-40 md:h-48 flex flex-col justify-center text-white text-sm md:text-[16px] leading-4 md:leading-6">
          <h1 className="font-medium text-xl md:text-2xl leading-[30px]">Information</h1>
          <ul className="mt-1">
            {infoLinks.map((link, index) => (
              <li key={index} className="py-2">
                <Link to={'/'+link.toLowerCase().replace(' ','-')}>{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-[231px] h-40 md:h-48 flex flex-col justify-between items-start text-white text-sm md:text-[16px] leading-3 md:leading-6">
          <h1 className="text-xl md:text-2xl leading-[30px] font-medium">Contact Information</h1>
          {contactInfo.map((info, index) => (
            <p key={index}>
              <span className="font-semibold">{info.label}: </span>
              <a href={info.href}>{info.value}</a>
            </p>
          ))}
        </div>

        <div className="w-[292px] h-40 md:h-48 flex flex-col justify-start gap-3 items-start text-white text-sm md:text-[16px] leading-3 md:leading-6">
          <h1 className="text-xl md:text-2xl font-medium leading-[30px]">Warehouse Location</h1>
          <h3 className="font-semibold">Location</h3>
          <p>{footer?.location_title}</p>
          {/* <h3 className="font-semibold">Open</h3>
          <p>Mon-Fri 8:00am-5:00pm (est)</p> */}
        </div>

      </div>

      <div className="my-6 border-b border-white/15 max-w-[1200px] w-full"></div>

      <div className="text-sm md:text-[16px] text-white leading-6 font-medium text-center px-4">
        Copyright ©2025 Pro Edge. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;