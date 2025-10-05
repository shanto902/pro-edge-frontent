import React, { useContext } from "react";
import ContactInfoItem from "../../components/contactus/ContactInfoItem";
import SocialIcon from "../../components/contactus/SocialIcon";
import InputField from "../../components/contactus/InputField";
import SelectField from "../../components/contactus/SelectField";
import TextareaField from "../../components/contactus/TextArea";
import call from "../../assets/images/contact/call.png"
import mail from "../../assets/images/contact/mail.png"
import location from "../../assets/images/contact/location.png"
import formFields from "../../data/contactus/FormFields";
import Map from "../../components/contactus/Map";
import Button from "../../components/contactus/Button";
import axios from "axios";
import insta from "../../assets/images/contact/insta.png";
import fb from "../../assets/images/contact/fb.png";
import ln from "../../assets/images/contact/in.png";
import twit from "../../assets/images/contact/twit.png";
import { useEffect, useState } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { fetchPageBlocks } from "../../context/PageContext";
import PageHeader from "../../components/common/utils/banner/SubPageHeader";
import { useQuery } from "@tanstack/react-query";
import { useProductContext } from "../../context/ProductContext";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const [footer, setFooter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categories } = useContext(CategoryContext);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    subject: "",
    category: "",
    details: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
   const { data: blocks = [],  } = useQuery({
    queryKey: ['pageBlocks', 'contact-us'],
    queryFn: () => fetchPageBlocks('contact-us'),
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
  const {setSearchTerm}=useProductContext();

  const breadcrumb = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "breadcrumb"
  )[0];
  const pageTitle = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "page_title"
  )[0];
  const feature = blocks?.filter(
    (block) => block?.item?.type?.toLowerCase().trim() === "feature"
  )[0];
  // console.log("feature", feature);
useEffect(() => {
      if (location.pathname !== "/products") setSearchTerm("");
  }, []);
  const ALL_FOOTER_QUERY = `
    query {
      footer {
        id
        footer_title
        contact_number
        fax
        phone_no
        email
        location_title
        location_url
        facebook
        instagram
        linkedin
        x
      }
    }
  `;

  const fetchFooter = async () => {
    setLoading(true);
    setError(null);
    try {
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
    } finally {
      setLoading(false);
    }
  };
 console.log(footer);
  useEffect(() => {
    fetchFooter();
  }, []);

  const CREATE_CONTACTS_MUTATION = `
    mutation CreateContact($data: create_contacts_input!) {
      create_contacts_item(data: $data) {
        id
        first_name
        last_name
        email
        phone_number
        subject
        category
        details
      }
    }
  `;

  const createContact = async (contactData) => {
    setCreating(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: CREATE_CONTACTS_MUTATION,
          variables: { data: contactData },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.create_contacts_item;
    } catch (error) {
      console.error("GraphQL mutation error:", error);
      setError(error.message);
      return null;
    } finally {
      setCreating(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    // Check each field individually
    if (!formData.first_name?.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name?.trim()) newErrors.last_name = "Last name is required";

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number (10-15 digits)";
    }

    if (!formData.subject?.trim()) newErrors.subject = "Subject is required";
    if (!formData.category?.trim()) newErrors.category = "Category is required";
    if (!formData.details?.trim()) newErrors.details = "Details are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("Field changed:", name, value); // Debug log
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("Form data before validation:", formData); // Debug log

    if (!validateForm()) {
      // console.log("Validation failed", errors); // Debug log
      return;
    }

    try {
      // console.log("Submitting form data:", formData); // Debug log
      const result = await createContact(formData);
      if (result) {
        setIsSubmitted(true);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          subject: "",
          category: "",
          details: ""
        });
      }
    } catch (err) {
      console.error("Submission error:", err); // Debug log
      setError("Failed to submit the form. Please try again.");
    }
  };

  const socialLinks = [
    { icon: insta, to: footer.instagram },
    { icon: fb, to: footer.facebook },
    { icon: ln, to: footer.linkedin },
    { icon: twit, to: footer.x },
  ];

const contactInfoItems = [
  {
    icon: call,
    title: "Phone Number",
    content: footer.phone_no
  },
  {
    icon: mail,
    title: "Email Address",
    content: footer.email
  },
  {
    icon: location,
    title: "Location",
    content: footer.location_title
  }
];  
  return (
    <>
     <Helmet>
        <title> ProEdge</title>
        <meta name="description" content="Welcome to ProEdge. Discover our products and services." />
      </Helmet>
      <PageHeader
        title={breadcrumb?.item?.title}
        bgImage={`${import.meta.env.VITE_SERVER_URL}/assets/${breadcrumb?.item?.image?.id}`}
        breadcrumbs={[{ link: "/", label: "Home" }, { label: breadcrumb?.item?.title }]}
      />
      <section className="w-full max-w-[1200px] mx-auto mt-3 md:mt-20 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-10">
        {/* Contact Information Section */}
        <div className="w-full max-w-md h-[549px] bg-[#3F66BC] py-8 px-6 rounded-[16px] mx-auto flex flex-col justify-between text-white">
          <div className="flex flex-col gap-[16px]">
            <h1 className="font-semibold text-[32px] leading-10">
              {feature?.item?.title} 
            </h1>
            <p className="font-medium text-[16px] leading-[26px]">
              {feature?.item?.subtitle}
            </p>
          </div>

          <div className="h-[344.5px] flex flex-col justify-between">
            {contactInfoItems.map((item, index) => (
              <ContactInfoItem
                key={index}
                icon={item.icon}
                title={item.title}
                content={item.content}
              />
            ))}

            <div className="flex gap-[24px]">
              {socialLinks
                .filter((link) => link.to)
                .map((social, index) => (
                  <SocialIcon key={index} icon={social.icon} url={social.to} />
                ))}
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="w-full max-w-3xl h-[630px] relative mx-auto">
          <h1 className="font-semibold text-4xl leading-12 text-center md:text-left">
            {pageTitle?.item?.page_title}
          </h1>
          {isSubmitted ? (
            <div className="mt-8 p-4 bg-green-100 text-green-700 rounded">
              Thank you for your message! We'll get back to you soon.
            </div>
          ) : ''}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center lg:items-start gap-[16px] mt-8">
              {/* First row of fields */}
              <div className="flex flex-col md:w-full md:flex-row justify-between gap-6">
                {formFields.slice(0, 2).map((field, index) => (
                  <div key={index} className="flex-1">
                    <InputField
                      type={field.type}
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      fullWidth={field.fullWidth}
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Second row of fields */}
              <div className="flex flex-col md:w-full md:flex-row justify-between gap-6">
                {formFields.slice(2, 4).map((field, index) => (
                  <div key={index} className="flex-1">
                    <InputField
                      type={field.type}
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      fullWidth={field.fullWidth}
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>



            <div className="w-[350px] md:w-full flex flex-col justify-center items-center gap-4">
  
              {/* Full width fields */}
              {formFields.slice(4).map((field, index) => (
                <div key={index} className="w-full">
                  <InputField
                    type={field.type}
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    fullWidth={true}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}

              <div className="w-full">
                <SelectField
                  id="category"
                  name="category"
                  options={categories.map((cat) => ({
                    label: cat.category_name,
                    value: cat.id,
                  }))}
                  fullWidth={true}
                  value={formData.category}
                  onChange={handleChange}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div className="w-full">
                <TextareaField
                  id="details"
                  name="details"
                  placeholder="Details*"
                  fullWidth={true}
                  value={formData.details}
                  onChange={handleChange}
                />
                {errors.details && (
                  <p className="text-red-500 text-sm mt-1">{errors.details}</p>
                )}
              </div>

              {error && (
                <div className="w-full p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

          </div>
              <Button
                type="submit"
                className="w-[350px] md:w-auto self-end mt-4 mx-auto"
                disabled={creating}
              >
                {creating ? "Submitting..." : "Submit Now"}
              </Button>
            </div>
          </form>
        </div>
      </section>
      <Map locationUrl={footer?.location_url} />
    </>
  );
};

export default Contact;
