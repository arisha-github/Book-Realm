import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from
 'react-router-dom'; 
 import Home from './components/Home';
 import Footer from './components/Footer';
import About from './components/About';
import Shop from './components/Shop';
import { CartProvider } from "./context/CartContext";
import Navbar from './components/Navbar';
import Register from './components/Register';
import Contact from './components/ContactPage';
import Login from './components/Login';
import Cart from './components/Cart';
import Genre from './components/Genre';
import Bestsellers from './components/Bestsellers';
import UDashboard from './components/UDashboard';
import ProductPage from './components/Productpage';
import Profile from './components/Profile';
import Success from './components/Success';
import Ereader from './components/Ereader';
import Wishlist from './components/Wishlist'


// Define your routes
const router = createBrowserRouter([
  
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <Home/>
          <Genre/>
          <Bestsellers/>
          <Footer/>
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
        <Navbar/>
          <About />
          <Footer/>
        </>
      ),
    },
    {
      path: '/register', // Add Register route here
      element: (
        <>
          <Navbar />
          <Register />
          <Footer />
        </>
      ),
    },
    {
      path: '/login', // Add Register route here
      element: (
        <>
          <Navbar />
          <Login />
          <Footer />
        </>
      ),
    },
    {
      path: '/contactus', 
      element: (
        <>
          <Navbar />
          <Contact />
          <Footer />
        </>
      ),
    },
    {
      path: '/udashboard', 
      element: (
        <>
          <Navbar />
          <UDashboard />
          <Footer />
        </>
      ),
    },
    {
      path: '/shop', 
      element: (
        <>
          <Navbar />
          <Shop/>
          <Footer />
        </>
      ),
    },
    {
      path: '/profile', 
      element: (
        <>
          <Navbar />
          <Profile/>
          <Footer />
        </>
      ),
    },
    {
      path: '/cart', 
      element: (
        <>
          <Navbar />
          <Cart/>
          <Footer />
        </>
      ),
    },
    {
      path: '/productpage/:bookId', 
      element: (
        <>
          <Navbar />
          <ProductPage/>
          <Footer />
        </>
      ),
    },
    {
      path: 'wishlist', 
      element: (
        <>
          <Navbar />
          <Wishlist/>
          <Footer />
        </>
      ),
    },
    {
      path:'/success',
      element:(
        <>
        <Navbar/>
        <Success/>
        <Footer/>
        </>
      ),
    },
    {
      path:'/Ereader/:bookId',
      element:(
        <>
        <Ereader/>
        <Footer/>
        </>
      ),
    },
]);

// Render the app with RouterProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} /> {/* RouterProvider wraps the app */}
    </CartProvider>
  </StrictMode>
);