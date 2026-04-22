import { createHashRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Movies from "./pages/Movies";
import Software from "./pages/Software";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";

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
    ],
  },
]);