// src/layouts/Root.jsx
import { Outlet } from "react-router-dom";

import { CategoryProvider } from "../context/CategoryContext";
import { ProductProvider } from "../context/ProductContext";
import { CartProvider } from "../context/CartContext";
import { OrderProvider } from "../context/OrderContext";
import { FaqProvider } from "../context/FaqContext";
import Header from '../components/common/header/Header'
import Footer from '../components/common/footer/Footer'


export default function Root() {
  return (
    <CategoryProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <FaqProvider>
              {/* Your common layout */}
              <Header />
              <Outlet />
              <Footer />
            </FaqProvider>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </CategoryProvider>
  );
}
