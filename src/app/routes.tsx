import { createHashRouter } from "react-router"; // CHANGED THIS
import Layout from "./components/Layout";
import Home from "./pages/Home";
// ... (import your other pages)

export const router = createHashRouter([ // CHANGED THIS
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "music", Component: Music },
      { path: "movies", Component: Movies },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      // ... rest of routes
    ],
  },
]);