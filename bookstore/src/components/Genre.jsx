import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Genre.css";

const Genre = () => {
  const [activeCategory, setActiveCategory] = useState("Fiction");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    "Fiction",
    "Romance",
    "Fantasy",
    "Adventure",
    "Thrillers",
    "Travel",
    "Women",
    "Anime"
  ];

  const randomPrices = [123, 65, 34]; // Fallback for books without a price

  // Fetch books from API
  const fetchBooks = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=40`
      );
      const fetchedBooks = response.data.items || [];

      const processedBooks = fetchedBooks
        .filter(
          (book) =>
            book.volumeInfo.language === "en" && // English books only
            book.volumeInfo.imageLinks?.thumbnail // Ensure thumbnail exists
        )
        .slice(0, 8) // Limit to 8 books
        .map((book) => {
          const price =
            book.saleInfo.retailPrice?.amount ||
            randomPrices[Math.floor(Math.random() * randomPrices.length)];
          return {
            id: book.id,
            name: book.volumeInfo.title,
            writer: book.volumeInfo.authors?.[0] || "Unknown Author",
            price: `${price} AED`,
            image: book.volumeInfo.imageLinks.thumbnail,
          };
        });

      setBooks(processedBooks);
    } catch (err) {
      setError("Error fetching books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(activeCategory);
  }, [activeCategory]);

  return (
    <div
      className="genre-container"
      style={{
        backgroundImage: "url('/path-to-your-background-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header Section */}
      <div className="genre-header">
        <div className="line"></div>
        <div className="diamonds">
          <span className="small-diamond">◇</span>
          <span className="large-diamond">◆</span>
          <span className="small-diamond">◇</span>
        </div>
        <div className="text">Shop by Genre</div>
        <div className="diamonds">
          <span className="small-diamond">◇</span>
          <span className="large-diamond">◆</span>
          <span className="small-diamond">◇</span>
        </div>
        <div className="line"></div>
      </div>

      {/* Filter Buttons Section */}
      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "active" : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Section */}
      <div className="gallery">
        {loading && <p>Loading books...</p>}
        {error && <p>{error}</p>}
        {!loading &&
          !error &&
          books.map(({ id, name, writer, price, image }) => (
            <div className="gallery-item" key={id}>
            <div className="genre-image">
  <img
    src={image.includes("zoom=0") ? image.replace( "zoom=1") : image}
    alt={name}
    className="book-image"
    loading="lazy"
  />
</div>
              <div className="genre-info">
                <h4>{name}</h4>
                <div>
                  <small>{writer}</small>
                </div>
                <h5>
                  <span>{price}</span>
                </h5>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Genre;
