import React, { createContext, useContext, useEffect, useState } from 'react';
import directus from '../lib/directus'; // adjust path to your directus instance
import { readItems } from '@directus/sdk';

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    // console.log(directus,"directus")

    try {
      // Fetch products
      const productsData = await directus.request(
        readItems('product', {
          
          fields: [
            'id',
            'title',
            'slug',
            'product_category.id',
            'product_category.child_category_name',
            'product_category.sub_category.subcategory_name',
            'product_category.sub_category.parent_category.category_name',
            'variation.id',
            'variation.variation_name',
            'variation.features',
            'variation.regular_price',
            'variation.offer_price',
            'variation.stock',
            'variation.product_details',
            'variation.product_info',
            'variation.sku_code',
            'variation.rating',
            'variation.total_ratings',
            'variation.order.id'
            
            
          ]
        })
      );

      // Fetch categories
      const categoriesData = await directus.request(
        readItems('parent_category', {
          fields: ['id']
        })
      );

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Directus REST fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ products, categories, loading }}>
      {children}
    </ProductContext.Provider>
  );
};
