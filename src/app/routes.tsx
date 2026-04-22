import { createHashRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Movies from "./pages/Movies";
import Software from "./pages/Software";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import Services from "./pages/Services";
import Nonstop from "./pages/Nonstop";
import Subscription from "./pages/Subscription";
import LearnMore from "./pages/LearnMore";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import EventBooking from "./pages/EventBooking";
import DJDrops from "./pages/DJDrops";
import MoviePlayer from "./pages/MoviePlayer";
import NotFound from "./pages/NotFound";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "music", Component: Music },
      { path: "movies", Component: Movies },
      { path: "software", Component: Software },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "admin", Component: AdminDashboard },
      { path: "services", Component: Services },
      { path: "nonstop", Component: Nonstop },
      { path: "subscription", Component: Subscription },
      { path: "learn-more", Component: LearnMore },
      { path: "cart", Component: Cart },
      { path: "contact", Component: Contact },
      { path: "profile", Component: Profile },
      { path: "event-booking", Component: EventBooking },
      { path: "dj-drops", Component: DJDrops },
      { path: "movie-player", Component: MoviePlayer },
      { path: "*", Component: NotFound },
    ],
  },
]);