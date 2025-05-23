import { createBrowserRouter } from "react-router";
import UserLayout from "../layouts/UserLayout";
import About from "../pages/About";
import Home from "../pages/Home";
import BooksPage from "../pages/Books";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import { BooksManagement } from "../components/admin/BookManagement";
import BookDetails from "../components/BookDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";
import Orders from "../pages/Orders";
import AdminOrders from "../pages/admin/Orders";
import BestSellerBooks from "../components/BestSellerBooks";
import NewArrivals from "../components/NewArrivals";
import NewReleases from "../components/NewReleases";
import AwardWinners from "../components/AwardWinners";
import ComingSoon from "../components/ComingSoon";
import Deals from "../components/Deals";
import PurchasedBooks from "../components/PurchasedBooks";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: UserLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "books", Component: BooksPage },
      { path: "books/:id", Component: BookDetails },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "signup", Component: Signup },
        ],
      },
      { path: 'cart', Component: Cart },
      { path: 'bestsellers', Component: BestSellerBooks },
      { path: 'checkout', Component: Checkout },
      { path: 'order-confirmation', Component: OrderConfirmation },
      { path: 'orders', Component: Orders },
      { path: "new-arrivals", Component: NewArrivals },
      { path: "new-releases", Component: NewReleases },
      { path: "award-winners", Component: AwardWinners },
      { path: "coming-soon", Component: ComingSoon },
      { path: "deals", Component: Deals },
      { path: "purchased-books", Component: PurchasedBooks }
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        path: "books",
        Component: BooksManagement
      },
      {
        path: "orders",
        Component: AdminOrders
      }
    ]
  },
]);

export default routes;