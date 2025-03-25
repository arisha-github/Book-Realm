import React, { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { FaHeart } from "react-icons/fa"
import axios from "axios"
import { SlBasket } from "react-icons/sl"
import { IoIosHeartEmpty } from "react-icons/io"
import { useCart } from "../context/CartContext"
import { jwtDecode } from "jwt-decode"
import ReviewModal from "./ReviewModal"
import "../styles/productpage.css";

const ProductPage = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { price: shopPrice } = location.state || {}

  const [book, setBook] = useState(null)
  const [isWishlistAdded, setIsWishlistAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [userBooks, setUserBooks] = useState([])
  const { addToCart } = useCart()
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [userReviews, setUserReviews] = useState([])
 

  const token = localStorage.getItem("token")

  const email = token ? jwtDecode(token).email : ""

  const handleAddToWishlist = () => {
    if (!book) return

    const wishlistItem = {
      book_id: bookId,
      title: book.volumeInfo.title || "Unknown Title",
      imageLinks: book.volumeInfo.imageLinks || {},
    }

    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || []
    const isAlreadyAdded = existingWishlist.some((item) => item.book_id === bookId)

    if (!isAlreadyAdded) {
      existingWishlist.push(wishlistItem)
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist))
      alert(`${wishlistItem.title} has been added to your wishlist!`)
      setIsWishlistAdded(true)
    } else {
      alert(`${wishlistItem.title} is already in your wishlist.`)
    }
  }

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        console.log("Fetching reviews for bookId:", bookId); // Debugging
        const response = await axios.get("http://localhost:5000/getReviews", {
          params: { bookId },
        });
        console.log("Response from backend:", response.data); // Debugging
        setUserReviews(response.data.reviews);
      } catch (err) {
        console.error("Error fetching Reviews:", err);
      }
    };
  
    if (bookId) {
      fetchUserReviews();
    }
  }, [bookId]);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-2xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
        setBook(response.data)
      } catch (err) {
        console.error("Error fetching book details:", err)
      }
    }

    fetchBookDetails()
  }, [bookId])

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getUserBooks", {
          params: { email },
        })
        setUserBooks(response.data.userBooks)
      } catch (err) {
        console.error("Error fetching user books:", err)
      }
    }

    if (email) {
      fetchUserBooks()
    }
  }, [email])

  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sanitizeDescription = (html) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }

  const handleReadNow = () => {
    const previewUrl = `https://books.google.com/books?id=${bookId}&printsec=frontcover&output=embed`
    window.open(previewUrl, "_blank")
  }

  const handleIncreaseQuantity = () => setQuantity((prev) => prev + 1)
  const handleDecreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (!book) return

    addToCart({
      book_id: bookId,
      title: book.volumeInfo.title || "Unknown Title",
      price: shopPrice || 0,
      quantity,
      imageLinks: book.volumeInfo.imageLinks || {},
    })
  }

  const scrollToTabs = () => {
    const tabsElement = document.getElementById("tabs-section")
    if (tabsElement) {
      tabsElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!book) {
    return <div className="loading-message">Loading book details...</div>
  }

  const { title, authors, description, imageLinks } = book.volumeInfo
  const price = shopPrice ?? "Not available"

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <div className="tab-content">{sanitizeDescription(description) || "No description available."}</div>
      case "whyBookRealm":
        return (
          <div className="tab-content">
            <p>
              At BookRealm Store, we believe books are more than just words on paper – they are gateways to new worlds,
              timeless wisdom, and boundless creativity. Whether you're looking for trending titles, timeless classics,
              or hidden gems, our collection is curated to inspire readers of all ages and tastes.
            </p>
            <p>
              Explore Our Collections:
              <ul>
                <li>
                  Fantasy & Adventure: Let your imagination soar with tales of magical realms and heroic journeys.
                </li>
                <li>
                  Classics & Literature: Revisit the greatest stories ever told and explore timeless masterpieces.
                </li>
                <li>Trending Titles: Stay ahead with the latest bestsellers and must-reads.</li>
                <li>Non-Fiction & Self-Help: Unlock knowledge, grow, and transform with insightful books.</li>
              </ul>
            </p>
          </div>
        )
      case "reviews":
        return (
          <div className="p-6 bg-white shadow-lg rounded-lg z-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="add-review-button"
            >
              Add Your Review
            </button>
          </div>
    
          {userReviews.length > 0 ? (
            <div className="space-y-6">
              {userReviews.map((review, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700">{review.review}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
               <button
              onClick={() => setIsReviewModalOpen(true)}
              className="add-review-button"
            >
              Add Your Review
            </button>
              <p className="text-gray-600 text-lg">No reviews found for this book.</p>
            </div>
          )}
    
          {/* Review Modal */}
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            bookId={bookId}
          />
        </div>
    
        )
      default:
        return null
    }
  }

  return (
    <div className="product-page">
      <div className="product-page-container">
        <div className="product-header">
          <img
            loading="lazy"
            src={imageLinks?.thumbnail?.replace("zoom=0", "zoom=1") || "/placeholder-image.png"}
            alt={title || "No title available"}
            className="product-image"
          />
        </div>

        <div className="product-details">
          <h1 className="product-title">{title || "No title available"}</h1>
          <p className="product-authors">By {authors?.join(", ") || "Unknown author"}</p>
          <p className="product-price">{price !== "Not available" ? `${price} AED` : price}</p>

          <div className="product-description">
            {sanitizeDescription(description)?.split(" ").slice(0, 20).join(" ")}...
            <span className="show-more" onClick={scrollToTabs}>
              Show more
            </span>
          </div>

          <div className="quantity-subtotal-box">
            <div className="quantity-controls">
              <strong>Quantity:</strong>
              <div className="quantity-box">
                <button onClick={handleDecreaseQuantity} className="quantity-button">
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button onClick={handleIncreaseQuantity} className="quantity-button">
                  +
                </button>
              </div>
            </div>

            <div className="subtotal">
              <strong>Subtotal: </strong>
              {price !== "Not available" && typeof price === "number"
                ? `${(price * quantity).toFixed(2)} AED`
                : "Not available"}
            </div>
          </div>

          <div className="action-buttons">
            {userBooks.includes(bookId) ? (
              <button className="add-to-cart-button" onClick={handleReadNow}>
                <SlBasket className="book-icon" />
                READ NOW
              </button>
            ) : (
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                <SlBasket className="basket-icon" />
                ADD TO CART
              </button>
            )}
          </div>

          <button className="add-to-wishlist-button" onClick={handleAddToWishlist}>
            <IoIosHeartEmpty className="basket-icon" />
            ADD TO WISHLIST
          </button>
        </div>
      </div>

      <div id="tabs-section" className="tabs-section">
        <div className="tabs-navigation">
          <button className={activeTab === "description" ? "active" : ""} onClick={() => setActiveTab("description")}>
            Description
          </button>
          <button className={activeTab === "whyBookRealm" ? "active" : ""} onClick={() => setActiveTab("whyBookRealm")}>
            Why BookRealm?
          </button>
          <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
            Reviews
          </button>
        </div>

        {renderTabContent()}
      </div>
    </div>
  )
}

export default ProductPage

