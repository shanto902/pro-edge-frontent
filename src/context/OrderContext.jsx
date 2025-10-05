// src/contexts/OrderContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const OrderContext = createContext();

export const useOrderContext = () => useContext(OrderContext);

const GET_ORDER_QUERY = `
  query GetOrders($customer_id_filter: string_filter_operators, $email_filter: string_filter_operators) {
    order(
      filter: {
        _or: [
          { customer_id: $customer_id_filter }
          { email: $email_filter }
        ]
      }
    ) {
      id
      order_id  
      customer_id
      name
      company_name
      phone_number
      email
      street_address
      address_two
      city
      state
      delivery_method
      zip_code
      shipping_charge
      subtotal
      tax
      order_status
      payment_method
      payment_status
      currency
      billing_name
      billing_company_name
      billing_phone_number
      billing_email
      billing_street_address
      billing_address_two
      billing_city
      billing_state
      billing_zip_code
    }
  }
`;

const GET_SETTINGS_QUERY = `
  query {
    Settings {
      id
      Shipping_days
      delivery_address 
      standard_ground_shipping_charge
      same_day_shipping_charge
    }
  }
`;

const SINGLE_ORDER_QUERY = `
  query GetOrderById($id: ID!) {
    order_by_id(id: $id) {
      id
      order_id  
      customer_id
      name
      company_name
      phone_number
      email
      street_address
      address_two
      city
      state
      delivery_method
      zip_code
      shipping_charge
      subtotal
      tax
      order_status
      payment_method
      payment_status

      currency
      billing_name
      billing_company_name
      billing_phone_number
      billing_email
      billing_street_address
      billing_address_two
      billing_city
      billing_state
      billing_zip_code
    }
  }
`;
const UPDATE_ORDER_MUTATION = `
  mutation UpdateOrder($id: ID!, $data: update_order_input!) {
    update_order_item(id: $id, data: $data) {
      id
      order_id  
      customer_id

      name
      company_name
      phone_number
      email
      street_address
      address_two
      city
      state
      delivery_method
      zip_code
      shipping_charge
      subtotal
      tax
      order_status
      payment_method
      payment_status

      currency
      billing_name
      billing_company_name
      billing_phone_number
      billing_email
      billing_street_address
      billing_address_two
      billing_city
      billing_state
      billing_zip_code
    }
  }
`;

const CREATE_ORDER_MUTATION = `
  mutation CreateOrder($data: create_order_input!) {
    create_order_item(data: $data) {
      id
      order_id 
      customer_id  
      name
      company_name
      phone_number
      email
      street_address
      address_two
      city
      state
      delivery_method
      zip_code
      shipping_charge
      subtotal
      tax
      order_status
      payment_method
      payment_status
      currency
      billing_name
      billing_company_name
      billing_phone_number
      billing_email
      billing_street_address
      billing_address_two
      billing_city
      billing_state
      billing_zip_code
    }
  }
`;
const CREATE_ORDER_DETAILS_MUTATION = `
  mutation CreateOrderDetails($data: create_order_details_input!) {
    create_order_details_item(data: $data) {
      id
      order_id {
        id
      }
      variation_id {
        id
      }
      product_title
      user_id {
        id
        email
      }
      user_email
      total_price
      quantity
    }
  }
`;

const DELETE_ORDER_MUTATION = `
  mutation DeleteOrder($id: ID!) {
    delete_order_item(id: $id) {
      id
    }
  }
`;

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      // Prepare filters based on available user data
      const variables = {
        customer_id_filter: { _eq: user?.id },
        email_filter: {
          _eq: user?.email,
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: GET_ORDER_QUERY,
          variables,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const ordersList = response.data.data.order || [];
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        "Failed to fetch orders"
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderByEmailAndOrderId = async (email, orderId) => {
    setOrderLoading(true);
    setError(null);
    try {
      const variables = {
        customer_id_filter: {},
        email_filter: { _eq: email },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: GET_ORDER_QUERY,
          variables,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const ordersList = response.data.data.order || [];
      const foundOrder = ordersList.find(
        (order) => order.order_id === orderId
      );

      if (foundOrder) {
        setCurrentOrder(foundOrder);
        return foundOrder;
      } else {
        setCurrentOrder(null);
        return null;
      }
    } catch (error) {
      console.error("Error fetching order by email and order_id:", error);
      setError(
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        "Failed to fetch order"
      );
      setCurrentOrder(null);
      return null;
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchOrderById = async (orderid) => {
    // console.log(orderid, "orderid");
    if (orderid.length < 6) {
      return null;
    }

    const id = orderid.split("-")[1];
    // console.log(id, "last digit");

    // First check local orders
    const localOrder = orders.find(
      (order) => order.id === orderid || order.order_id === orderid
    );
    if (localOrder) {
      setCurrentOrder(localOrder);
      return localOrder;
    }

    setOrderLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: SINGLE_ORDER_QUERY,
          variables: { id },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      // console.log(response)

      const order = response.data.data.order_by_id;
      if (order) {
        setCurrentOrder(order);
        return order;
      }
      throw new Error("Order not found");
    } catch (error) {
      console.error("GraphQL fetch error:", error);
      setError(error.message);
      return null;
    } finally {
      setOrderLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    setCreating(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: CREATE_ORDER_MUTATION,
          variables: { data: orderData },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );


      const newOrder = response.data.data.create_order_item;
      setOrders((prev) => [...prev, newOrder]);

      return newOrder;
    } catch (error) {
      console.error("GraphQL mutation error:", error);
      setError(error.message);
      return null;
    } finally {
      setCreating(false);
    }
  };

  const createOrderDetails = async (orderDetailsData) => {
    setCreating(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: CREATE_ORDER_DETAILS_MUTATION,
          variables: { data: orderDetailsData },
        },
        {
          headers: { "Content-Type": "application/json" },
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        }
      );

      // console.log(response.data, 'response');

      const newOrder = response.data.data.create_order_details_item;
      setOrders((prev) => [...prev, newOrder]);

      return newOrder;
    } catch (error) {
      console.error("GraphQL mutation error:", error);
      setError(error.message);
      return null;
    } finally {
      setCreating(false);
    }
  };

  //update order
  const updateOrder = async (orderId, updatedFields) => {
    setCreating(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: UPDATE_ORDER_MUTATION,
          variables: {
            id: orderId,
            data: updatedFields, // Pass updated fields as the data for the mutation
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // console.log(response.data, 'update response');

      // Handle errors if they exist
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      // If successful, update the state
      const updatedOrder = response.data.data.update_order_item;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );

      return updatedOrder;
    } catch (error) {
      console.error("GraphQL update error:", error);
      setError(error.message);
      return null;
    } finally {
      setCreating(false);
    }
  };

  const deleteOrder = async (orderId) => {
    setCreating(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: DELETE_ORDER_MUTATION,
          variables: {
            id: orderId,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // console.log(response.data, 'delete response');

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const deleted = response.data.data.delete_order_item;
      setOrders((prev) => prev.filter((order) => order.id !== deleted.id));

      return deleted;
    } catch (error) {
      console.error("GraphQL delete error:", error);
      setError(error.message);
      return null;
    } finally {
      setCreating(false);
    }
  };

  const fetchSettingsGraphQL = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/graphql`,
        {
          query: GET_SETTINGS_QUERY,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.data.Settings, "settings");
      return response.data.data.Settings;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        loading,
        error,
        currentOrder,
        orderLoading,
        orders,
        creating,
        fetchOrders,
        fetchOrderById,
        fetchOrderByEmailAndOrderId,
        createOrder,
        updateOrder,
        deleteOrder,
        createOrderDetails,
        refetchOrders: fetchOrders,
        fetchSettingsGraphQL,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
