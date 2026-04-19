import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Music from "./pages/Music";
import Movies from "./pages/Movies";
import Software from "./pages/Software";
import Cart from "./pages/Cart";
import Subscription from "./pages/Subscription";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MoviePlayer from "./pages/MoviePlayer";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      { path: "music", Component: Music },
      { path: "my-library", Component: MyLibrary },
      { path: "movies", Component: Movies },
      { path: "movies/watch/:id", Component: MoviePlayer },
      { path: "software", Component: Software },
      { path: "cart", Component: Cart },
      { path: "subscription", Component: Subscription },
      { path: "contact", Component: Contact },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "profile", Component: Profile },
      { path: "admin", Component: AdminDashboard },
      { path: "learn-more", Component: LearnMore },
      { path: "*", Component: NotFound },
    ],
  },
]);
