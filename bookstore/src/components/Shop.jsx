import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/shop.css";
import { FaMagnifyingGlass } from "react-icons/fa6";

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const navigate = useNavigate();


  // Handle author checkbox change
  const handleAuthorChange = (event) => {
    const { value, checked } = event.target;
    setSelectedAuthors((prev) =>
      checked ? [...prev, value] : prev.filter((author) => author !== value)
    );
  };

  // Random prices to assign to books with no price
  const randomPrices = [123, 65, 34];

  // Fetch books based on query
  const fetchBooks = async (query = "fiction") => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`
      );
      const fetchedBooks = response.data.items || [];

      // Process books to assign random price if no price is available
      const processedBooks = fetchedBooks
        .map((book) => {
          const price =
            book.saleInfo.retailPrice?.amount ||
            randomPrices[Math.floor(Math.random() * randomPrices.length)];
          return {
            ...book,
            saleInfo: {
              ...book.saleInfo,
              retailPrice: {
                ...book.saleInfo.retailPrice,
                amount: price,
              },
            },
          };
        })
        .filter(
          (book) =>
            book.volumeInfo.language !== "ar" && // Exclude Arabic books
            book.volumeInfo.imageLinks?.thumbnail && // Ensure book has a thumbnail
            (book.accessInfo.viewability === "PARTIAL" || // Include only books with partial preview
              book.accessInfo.viewability === "ALL_PAGES") // Include books with full preview
        );
      setBooks(processedBooks);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    const authorQueries = selectedAuthors.length
      ? selectedAuthors.join("+OR+") // Create OR query for selected authors
      : "";
    const subjectQuery = selectedSubject !== "All" ? `+subject:${selectedSubject}` : "";
    const finalQuery = `${searchQuery} ${authorQueries} ${subjectQuery}`.trim();

    fetchBooks(finalQuery || "fiction"); // Fallback to 'fiction' if no query
  }, [selectedSubject, searchQuery, selectedAuthors]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredBooks = books
    .filter((book) => {
      const price = book.saleInfo.retailPrice.amount;
      return price >= priceRange.min && price <= priceRange.max;
    })
    .sort((a, b) => {
      const priceA = a.saleInfo.retailPrice.amount;
      const priceB = b.saleInfo.retailPrice.amount;
      return sortOrder === "lowToHigh" ? priceA - priceB : priceB - priceA;
    });

  return (
    <>
      {/* First div for shop hero */}
      <div className="shophero">
        <h1 className="shop-title">Discovering the Magical Realm of</h1>
        <h1 className="shop-subtitle">Books</h1>
        <p className="shop-description">
       
        Immerse yourself in a world of literary wonders, where every page turns into an 
        adventure waiting to unfold.Discover a treasure trove of books spanning genres
        and generations, from timeless classics to modern bestsellers. 
        Whether you’re a seeker of epic fantasies, a lover of heartwarming romances, or a curious mind
        exploring the depths of non-fiction, Here, every book has a story 
        to tell and a realm to explore. Lose yourself in the magic of words, meet characters who feel 
        like old friends, and find inspiration in the pages of extraordinary tales. 

        </p>
      </div>

      {/* Main shop container */}
      <div className="shop-container">
      <h1 className="shop-title-one">Shop Now</h1>
        <div className="search-and-sort">
          {/* Search Bar */}
          <div className="search-bar-container">
            <div className="search-bar-wrapper">
              <input
                type="text"
                onChange={handleSearchChange}
                placeholder="Search for books, authors, titles..."
                value={searchQuery}
                className="booksearch-input"
              />
              <button className="search-icon-button">
                <FaMagnifyingGlass />
              </button>
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="sort-by">
            <label htmlFor="sortBy">SORT BY:</label>
            <select id="sortBy" value={sortOrder} onChange={handleSortChange}>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="shop-content">
          {/* Filters Section */}
          <div className="filters-sidebar">
            <div className="filter-category">
              <h3>CATEGORIES</h3>
              <select value={selectedSubject} onChange={handleSubjectChange}>
                <option value="All">All</option>
                <option value="Fiction">Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="Young Adult">Young Adult</option>
                <option value="Adventure">Adventure</option>
                <option value="Manga">Manga</option>
                <option value="Anime">Anime</option>
              </select>
            </div>

            {/* Author Filters */}
            <div className="filter-authors">
              <h3>TOP AUTHORS</h3>
              <label>
              <span> Stephan King</span>
                <input
                  type="checkbox"
                  value="Stephen King"
                  onChange={handleAuthorChange}
                />
              
              </label>

              <label>
              <span>Colleen Hoover</span>
                <input
                  type="checkbox"
                  value="Colleen Hoover"
                  onChange={handleAuthorChange}
                />
            
              </label>

              <label>
              <span>Sarah J. Maas</span>
                <input
                  type="checkbox"
                  value="Sarah J. Maas"
                  onChange={handleAuthorChange}
                />
      
              </label>

              <label>
                <span> JK Rowling </span>
                <input
                  type="checkbox"
                  value="JK Rowling"
                  onChange={handleAuthorChange}
                />
                
              </label>
             
              <label>
                <span>Ana Huang</span>
                <input
                  type="checkbox"
                  value="Ana Huang"
                  onChange={handleAuthorChange}
                />
                
              </label>
              <label>
                <span> Victoria Aveyard</span>
                <input
                  type="checkbox"
                  value=" Victoria Aveyard"
                  onChange={handleAuthorChange}
                />
                
              </label>
             
            </div>

            {/* Price Filter */}
            <div className="filter-price">
              <h4>FILTER PRICE BY</h4>
              <input
                type="range"
                name="min"
                min="0"
                max="1000"
                value={priceRange.min}
                onChange={handlePriceChange}
                className="price-slider"
              />
              <div className="price-labels">
                <span>{priceRange.min} AED</span>
                <span>{priceRange.max} AED</span>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <Link
  to={`/productpage/${book.id}`}
  className="book-link"
  state={{ price: book.saleInfo.retailPrice.amount }}
  onClick={(e) => {
    // Prevent default link behavior and ensure no scroll jumps
    e.preventDefault();
    navigate(`/productpage/${book.id}`, {
      state: { price: book.saleInfo.retailPrice.amount },
    });
  }}
>
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail
                        ? book.volumeInfo.imageLinks.thumbnail.replace("zoom=0")
                        : "/placeholder-image.png"
                    }
                    alt={book.volumeInfo.title || "No title available"}
                    className="book-images"
                    loading="lazy"
                  />
                  <h3 className="book-title">{book.volumeInfo.title}</h3>
                  <p className="book-price">
                    {`${book.saleInfo.retailPrice.amount} AED`}
                  </p>
                </Link>
              
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
