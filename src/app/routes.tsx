import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Movies from "./pages/Movies";
import Software from "./pages/Software";
import Cart from "./pages/Cart";
import Subscription from "./pages/Subscription";
import Payment from "./pages/Payment";
import PaymentHistory from "./pages/PaymentHistory";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPaymentDashboard from "./pages/AdminPaymentDashboard";
import MyLibrary from "./pages/MyLibrary";
import DJDropOrder from "./pages/DJDropOrder";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "music", Component: Music },
      { path: "movies", Component: Movies },
      { path: "software", Component: Software },
      { path: "cart", Component: Cart },
      { path: "subscription", Component: Subscription },
      { path: "payment", Component: Payment },
      { path: "payment-history", Component: PaymentHistory },
      { path: "contact", Component: Contact },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/payments", Component: AdminPaymentDashboard },
      { path: "my-library", Component: MyLibrary },
      { path: "dj-drops", Component: DJDropOrder },
    ],
  },
]);