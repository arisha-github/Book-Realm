import React, { useState } from "react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { useParams } from "react-router-dom"
import "../styles/ReviewModal.css"

const ReviewModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { bookId } = useParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const decodedToken = jwtDecode(token)
      const email = decodedToken.email

      const response = await axios.post("http://localhost:5000/submitreview", {
        bookId,
        email,
        name,
        rating,
        review,
      })

      console.log("Review submitted successfully:", response.data)

      window.alert("Your review has been submitted successfully!")

      // Close the modal
      onClose()
    } catch (error) {
      console.error("Error submitting review:", error)
      setError("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Your Review</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
        
  <label>Rating</label>
  <div className="rating-stars">
  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      className={`star ${star <= rating ? "filled" : ""}`} // Changed "selected" to "filled"
      onClick={() => setRating(star)}
    >
      ★
    </span>
  ))}
</div>

</div>

          <div className="form-group">
            <label htmlFor="review">Review</label>
            <textarea id="review" value={review} onChange={(e) => setReview(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewModal

