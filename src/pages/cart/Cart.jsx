import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductCardTiles from "../../components/common/utils/cards/ProductCardTiles";
import OrderSummaryCard from "../../components/common/utils/cards/OrderSummary";
import MostViewedSection from "../../components/home/MostViewed";
import { CartContext } from "../../context/CartContext";
import WishCard from "../../components/wishlist/WishCard";
import { useProductContext } from "../../context/ProductContext";
import { Helmet } from "react-helmet-async";
import { useOrderContext } from "../../context/OrderContext";

const Cart = () => {
  const {
    cartItems,
    wishlistItems,
    removeFromCart,
    removeFromWishlist,
    getCartTotal,
    addToCart,
  } = useContext(CartContext);
  const { fetchSettingsGraphQL } = useOrderContext();
  const [shippingData, setShippingData] = useState(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDeliveryData = async () => {
      try {
        const data = await fetchSettingsGraphQL();
        setShippingData(data);
      } catch (error) {
        console.error("Error fetching delivery location data:", error);
      }
    };

    fetchDeliveryData();
  }, []);

  // Calculate order summary data dynamically
  const orderSummary = {
    subtotal: getCartTotal(),
    shipping:
      getCartTotal() > 500
        ? 0
        : parseInt(shippingData?.standard_ground_shipping_charge),
    tax: 0,
    total:
      getCartTotal() +
      (getCartTotal() > 500
        ? 0
        : parseInt(shippingData?.standard_ground_shipping_charge)),
    discount: 0,
    type: "cart",
  };
  // console.table(cartItems);
  const { setSearchTerm } = useProductContext();

  useEffect(() => {
    if (location.pathname !== "/products") setSearchTerm("");
  }, []);
  return (
    <>
      <Helmet>
        <title> ProEdge</title>
        <meta
          name="description"
          content="Welcome to ProEdge. Discover our products and services."
        />
      </Helmet>

      <section className="w-full border-y-2 border-blue-950/10">
        <div className="max-w-7xl mx-auto px-6 md:px-4 py-2">
          {/* Breadcrumb */}
          <nav className="text-sm md:text-base flex items-center gap-2 text-gray-500">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span>/</span>
            <h2 className="text-gray-600">Cart</h2>
          </nav>

          {/* Title */}
          <h1 className="mt-0 text-xl md:text-2xl font-bold text-gray-900">
            Cart Items
          </h1>
        </div>
      </section>

      <section className="max-w-7xl w-full mx-auto mb-10 mt-5 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 ">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#182B55] mb-4 ">
            Shopping Cart ({cartItems.length}{" "}
            {cartItems.length === 1 ? "Item" : "Items"})
          </h1>
          {cartItems.length > 0 ? (
            cartItems.map((product, index) => (
              <ProductCardTiles
                key={index}
                product={product}
                onRemove={() => removeFromCart(product)}
              />
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty</p>
          )}
        </div>

        <OrderSummaryCard cart={orderSummary} />

        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#182B55] my-5">
            Shopping Later ({wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "Item" : "Items"})
          </h1>
          {wishlistItems.length > 0 ? (
            wishlistItems.map((product, index) => {
              const [dollars, cents] = product.price.toFixed(2).split(".");

              return (
                <WishCard
                  key={index}
                  image={product.image}
                  image_url={product.image_url}
                  title={product.variation_name}
                  priceDollars={dollars}
                  priceCents={`.${cents}`}
                  onAddToCart={() => {
                    addToCart(product);
                    removeFromWishlist(product);
                  }}
                  inStock={product.stock}
                  sku={`SKU-${product.sku}`}
                  shippingInfo="Free Shipping"
                  onRemove={() => removeFromWishlist(product)}
                />
              );
            })
          ) : (
            <p className="text-gray-500">Your wishlist is empty</p>
          )}
        </div>
      </section>
      <MostViewedSection title={"Products related to this items"} />
    </>
  );
};

export default Cart;
