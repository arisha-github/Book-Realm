import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { AiTwotoneBook } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { FaHeart } from "react-icons/fa"; // Import Wishlist Icon
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "/logo.png";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const navItems = [
    { title: "Home", path: "/" },
    { title: "About Us", path: "/about" },
    { title: "Shop", path: "/shop" },
    { title: "Contact Us", path: "/contactus" },
  ];

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=10`
      );
      const fetchedBooks = response.data.items || [];
      const processedBooks = fetchedBooks
        .filter(
          (book) =>
            book.volumeInfo.language === "en" && // Filter for English books only
            book.volumeInfo.imageLinks?.thumbnail
        )
        .slice(0, 6) // Limit to 6 books
        .map((book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          image: book.volumeInfo.imageLinks.thumbnail,
        }));

      setSearchResults(processedBooks);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (id) => {
    navigate(`/productpage/${id}`);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleUserIconClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile"); // Redirect to profile if token is present
    } else {
      navigate("/register"); // Redirect to register if no token
    }
  };

  return (
    <header>
      <nav className="navbar flex items-center justify-between px-6 py-4 bg-blue-900">
        {/* Search Bar */}
        <div className="relative search-bar-container flex items-center px-3 py-1 rounded-md border-2 border-blue-500 max-w-xs w-full">
          <input
            type="text"
            placeholder="Search books, authors..."
            className="search-input w-full outline-none bg-transparent border-none text-sm"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <IoSearchSharp className="text-gray-400" />
          {searchTerm && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-blue-800 text-white shadow-lg z-10 rounded-md max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 p-2">
                {searchResults.map((book) => (
                  <div
                    key={book.id}
                    className="cursor-pointer flex flex-col items-center text-center p-2 hover:bg-blue-700"
                    onClick={() => handleBookClick(book.id)}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-32 h-40 object-cover"
                    />
                    <p className="text-s text-darkblue mt-2">{book.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="logo-container flex justify-center items-center flex-grow">
          <Link to="/">
            <img src={logo} alt="logo" className="logo-img" />
          </Link>
        </div>

        {/* Icons */}
        <div className="icons flex gap-4">
          {/* Wishlist Icon */}
          <div className="wishlist-icon flex items-center">
            <Link
              to="/wishlist"
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <FaHeart className="icon text-2xl" />
            </Link>
          </div>

          {/* Cart Icon with Badge */}
          <div className="cart-icon relative flex items-center">
            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
            >
              <MdOutlineShoppingCart className="icon text-2xl" />
            </Link>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 text-xs font-bold text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          <div className="book-icon flex items-center">
            <Link
              to="/udashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
            >
              <AiTwotoneBook className="icon text-2xl" />
            </Link>
          </div>

          {/* User Icon */}
          <div
            className="user-icon flex items-center cursor-pointer"
            onClick={handleUserIconClick}
          >
            <FiUser className="icon text-2xl" />
          </div>
        </div>
      </nav>

      {/* Navbar Links */}
      <div className="pt-4">
        <ul className="lg:flex items-center justify-center space-x-2 m-0 p-0">
          {navItems.map(({ title, path }) => (
            <li key={path} className="nav-item m-0 p-0">
              <Link
                to={path}
                className="nav-link text-gray-600 hover:text-blue-500 flex items-center gap-2"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Announcement Bar */}
      <div className="announcement-bar text-center bg-blue-700 text-white py-2">
        <p>10% OFF ON YOUR FIRST ORDER</p>
      </div>
    </header>
  );
};

export default Navbar;
