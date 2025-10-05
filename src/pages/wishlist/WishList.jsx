import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import WishCard from "../../components/wishlist/WishCard.jsx";
import MostViewedSection from "../../components/home/MostViewed.jsx";
import { CartContext } from "../../context/CartContext.jsx";
import { useProductContext } from "../../context/ProductContext.jsx";

const WishList = () => {
  const { wishlistItems, removeFromWishlist, addToCart } =
    useContext(CartContext);
    // console.table(wishlistItems, 'wishlistItems');
 const {setSearchTerm}=useProductContext();

  useEffect(() => {
        if (location.pathname !== "/products") setSearchTerm("");
    }, []);
  return (
    <>
      <section className="w-full border-y-2 border-blue-950/10">
        <div className="max-w-7xl mx-auto px-6 md:px-4 py-2">
          {/* Breadcrumb */}
          <nav className="text-sm md:text-base flex items-center gap-2 text-gray-500">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-600">
             Wish-list
            </span>
          </nav>

          {/* Title */}
          <h1 className="mt-0 text-xl md:text-2xl font-bold text-gray-900">
            Wish List
          </h1>
        </div>
      </section>
      <section className="mb-10 mt-5 max-w-7xl w-full mx-auto px-2 md:px-12 lg:px-20">
        <h1 className="text-3xl text-[#182B55] font-bold">
          Wish List ({wishlistItems.length} Items)
        </h1>

        <div className="flex flex-col gap-6 mt-6">
          {wishlistItems.map((item, index) => {
            const [dollars, cents] = item.price.toFixed(2).split(".");

            return (
              <WishCard
                key={index}
                image={item.image}
                image_url={item.image_url}
                title={item.title}
                priceDollars={dollars}
                priceCents={`.${cents}`}
                onAddToCart={() => {
                  addToCart(item);
                  removeFromWishlist(item);
                }}
                inStock={item.stock}
                sku={`SKU-${item.sku}`}
                shippingInfo="Free Shipping"
                onRemove={() => removeFromWishlist(item)}
              />
            );
          })}
        </div>
      </section>

      <MostViewedSection title={"Products related to this items"} />
    </>
  );
};

export default WishList;
