import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Music from './pages/Music';
import Movies from './pages/Movies';
import MoviePlayer from './pages/MoviePlayer';
import Software from './pages/Software';
import Apps from './pages/Apps'; 
import Cart from './pages/Cart';
import Subscription from './pages/Subscription';
import MyLibrary from './pages/MyLibrary';
import DJDropOrder from './pages/DJDropOrder';
import WebDevelopment from './pages/WebDevelopment';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'music', Component: Music },
      { path: 'movies', Component: Movies },
      { path: 'movies/watch/:id', Component: MoviePlayer }, 
      { path: 'software', Component: Software },
      { path: 'apps', Component: Apps }, 
      { path: 'web-development', Component: WebDevelopment },
      { path: 'cart', Component: Cart },
      { path: 'subscription', Component: Subscription },
      { path: 'my-library', Component: MyLibrary },
      { path: 'dj-drops', Component: DJDropOrder },
      { path: 'admin', Component: AdminDashboard },
    ],
  },
  { path: '/login', Component: Login },
  { path: '/signup', Component: Signup },
]);