// src/contexts/ProductContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

const ALL_PRODUCTS_QUERY = `
  query GetAllProducts {
    product(limit: -1) {
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
  const maxRangeLimit = 5000;

  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(maxRangeLimit);
  const [isMadeUsa, setIsmadeUsa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

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

      const rawProducts = response.data.data?.product || [];

      const validProducts = rawProducts.filter(
        (product) => product.variation && product.variation.length > 0
      );

      console.log("Fetched Products Count:", validProducts.length);
      setProducts(validProducts);
      return validProducts;
    } catch (err) {
      console.error("GraphQL fetch error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
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

      const product = response.data.data.product?.[0];
      if (product) {
        return product;
      }

      throw new Error("Product not found");
    } catch (err) {
      console.error("GraphQL fetch error:", err);
      setError(err.message);
      throw err;
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        fetchProducts,
        refetchProducts: fetchProducts,

        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        maxRangeLimit,

        isMadeUsa,
        setIsmadeUsa,

        loading,
        productLoading,
        error,

        searchTerm,
        setSearchTerm,

        fetchProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
