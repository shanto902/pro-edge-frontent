import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components
import Home from "./pages/home/Home";
import Products from "./pages/products/Products";
import ProductDetails from "./pages/product-details/ProductDetails";
import Videos from "./pages/videos/Videos";
import TechHelp from "./pages/tech-help/TechHelp";
import Contact from "./pages/contact/Contact";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import Root from "./layouts/Root";
import Auth from "./layouts/Auth";
import CartPage from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import WishList from "./pages/wishlist/WishList";

//context provider
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { CategoryProvider } from "./context/CategoryContext";
import OrderTable from "./pages/order/OrdersTable";
import TrackOrderPage from "./pages/order/TrackOrderPage";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import OrderDetailsPage from "./pages/order/OrderDetailsPage";
import PrivateRoute from "./components/privaterroute/PrivateRoute";
import { FaqProvider } from "./context/FaqContext";
import FAQPage from "./pages/FAQ/FAQPage";
import UserProfile from "./pages/user/UserProfile";
import NotFoundPage from "./pages/404/NotFoundPage";
import Policies from "./pages/tech-help/Policies";
import Jsonit from "./pages/convert/Jsonit";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "single-product/:title", Component: ProductDetails },
      { path: "videos", Component: Videos },
      { path: "tech-help", Component: TechHelp },
      { path: "contact-us", Component: Contact },
      { path: "cart", Component: CartPage },
      { path: "cart/checkout", Component: Checkout },
      { path: "wish-list", Component: WishList },
      { path: "/faq/:section-title/:title?", Component: FAQPage },
      { path: "track-order", Component: TrackOrderPage },
      { path: "return-order", Component: TrackOrderPage },
      { path: "modify-order", Component: TrackOrderPage },
      { path: "order-details", Component: OrderDetailsPage },
      { path: "return-policy", Component: Policies },
      { path: "payment-policy", Component: Policies },
      { path: "terms-of-use", Component: Policies },      
      { path: "shipping-policy", Component: Policies },   
      { path: "json-it", Component: Jsonit },   
      {
        Component: PrivateRoute,
        children: [
          { path: "order-history", Component: OrderTable },
          { path: "profile", Component: UserProfile },
        ],
      },
      // Fallback route
      { path: "*", Component: NotFoundPage },
    ],
  },
  {
    path: "/auth",
    Component: Auth,
    children: [
      { path: "signin", Component: SignIn },
      { path: "signup", Component: SignUp },
      { path: "forgot-password", Component: ForgotPasswordPage },
      { path: "reset-password", Component: ResetPasswordPage },
    ],
  },
]);

function App() {
  
  return (
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <FaqProvider>
                <RouterProvider router={router} />
              </FaqProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
