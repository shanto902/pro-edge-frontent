// src/contexts/ProductContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

const ALL_PRODUCTS_QUERY = `
  query {
    product {
      id
      title
      slug

      product_category {
        id
        child_category_name
        sub_category {
          id
          subcategory_name
          parent_category {
            id
            category_name
          }
        }
      }
      variation {
        id
        variation_name
        variation_value
        features
	      regular_price
        offer_price
        stock
        product_details
        product_info
        sku_code
        rating
        total_ratings
        image {
          id
        }
        filters
        images {
      image {
        id
        title
        filename_download
      }
    }

        image_url
        made_in
        shipping_days
        date_created  
      }
    }
  }
`;

const SINGLE_PRODUCT_QUERY = `
  query GetProductById($id: GraphQLStringOrFloat!) {
    product(filter: { id: { _eq: $id } }) {
      id
      title
      slug
      

      product_category {
        id
        child_category_name
        sub_category {
          id
          subcategory_name
          parent_category {
            id
            category_name
          }
        }
      }
      variation {
        id
        variation_name
        variation_value 
        features
        regular_price
        offer_price
        stock
        product_details
        product_info
        sku_code
        rating
        total_ratings        
        image {
          id
        }
        images {
      image {
        id
        title
        filename_download
      }
    }

        image_url
        made_in
        shipping_days
        date_created
      }
    }
  }
`;

export const ProductProvider = ({ children }) => {
  let maxRangeLimit = 5000;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(maxRangeLimit);
  const [isMadeUsa, setIsmadeUsa] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/graphql`,
      {
        query: ALL_PRODUCTS_QUERY,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    setLoading(false);

    return (response.data.data.product || []).filter(
      (product) => product.variation && product.variation.length > 0
    );
  };

  const fetchProductById = async (id) => {
    setProductLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: SINGLE_PRODUCT_QUERY,
          variables: { id },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const product = response.data.data.product[0];
      if (product) {
        return product;
      }

      throw new Error("Product not found");
    } catch (error) {
      console.error("GraphQL fetch error:", error);
      setError(error.message);
      throw error;
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        maxRangeLimit,
        isMadeUsa,
        setIsmadeUsa,
        loading,
        error,
        productLoading,
        fetchProducts,
        fetchProductById,
        searchTerm,
        setSearchTerm,
        refetchProducts: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
