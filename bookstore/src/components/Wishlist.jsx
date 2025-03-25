import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext"; // Import CartContext
import "../styles/wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart(); // Get addToCart function from CartContext

  useEffect(() => {
    // Retrieve the wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  const handleAddToCart = (book) => {
    addToCart({
      book_id: book.book_id,
      title: book.title,
      price: 0, // Adjust price if needed
      quantity: 1,
      imageLinks: book.imageLinks,
    });

    alert(`${book.title} has been added to the cart!`);
  };

  const handleRemoveFromWishlist = (bookId) => {
    const updatedWishlist = wishlist.filter((book) => book.book_id !== bookId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    alert("Book removed from wishlist.");
  };

  return (
    <div className="wishlist-container">
      <h3 className="wishlist-title">My Wishlist</h3>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty!</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((book, index) => (
            <React.Fragment key={book.book_id}>
              <div className="wishlist-item">
                <img
                  src={book.imageLinks?.thumbnail || "/placeholder-image.png"}
                  alt={book.title || "No Title Available"}
                  className="wishlist-image"
                />
               
                <div className="button-container">
                  <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(book)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFromWishlist(book.book_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              {/* Insert a shelf after every 4 books */}
              {(index + 1) % 4 === 0 && <div className="shelf-wishlist"></div>}
            </React.Fragment>
          ))}
          {/* Add a final shelf at the end */}
          <div className="shelf-wishlist"></div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
