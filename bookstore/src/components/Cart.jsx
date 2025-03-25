import React, { useState, useEffect } from "react"; 
import "../styles/cart.css"; // Import the external CSS
import { useCart } from "../context/CartContext"; 
import axios from "axios"; 

const Cart = () => { 
  const { cart, removeFromCart, updateCartItemQuantity } = useCart(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [book, setBook] = useState(null); 

  const bookId = "some-book-id"; 

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 

    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        setBook(response.data);
      } catch (err) {
        console.error("Error fetching book details:", err);
      }
    };

    if (bookId) {
      fetchBookDetails(); 
    }
  }, [bookId]);

  const handleQuantityChange = (id, delta) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      updateCartItemQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token
        },
        body: JSON.stringify({ cartItems: cart }), // Sending cart items
      });
  
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout session URL
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      <div className="cart-content-wrapper">
        <div className="cart-content">
          <div className="cart-headings">
            <span>PRODUCT</span>
            <span className="q-cart">QUANTITY</span>
           <span className="p-cart">PRICE</span>
           <span> REMOVE</span>
          </div>
          <hr />

          {cart.length === 0 ? (
            <p className="text-lg text-center text-gray-500 py-10">Your cart is empty. Add some products to see them here!</p>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-product">
                    <img
                      src={item.imageLinks?.thumbnail || "/placeholder-image.png"}
                      alt={item.title || "No title available"}
                      className="cart-item-image"
                    />
                    <p className="cart-item-title">{item.title}</p>
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    AED {(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="order-summary">
          <h2 className="ordersummary-title">Order Summary</h2>
          <h2>Add Notes</h2>
          <textarea
            placeholder="Write your notes here..."
            className="order-notes"
          ></textarea>
          <div className="summary-details">
            <p className="text-lg font-semibold">
              <strong className=""> Subtotal:</strong> AED {calculateSubtotal().toFixed(2)}
            </p>
            {!isLoggedIn && (
              <div className="login-prompt">
                <p>Please <a href="/login" className="text-blue-600">Login</a> to purchase this item.</p>
              </div>
            )}

            <button
              className={`checkout-btn ${isLoggedIn ? 'bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
              onClick={handleCheckout}
              disabled={!isLoggedIn}
            >
              {isLoggedIn ? 'Checkout' : 'Login to Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
