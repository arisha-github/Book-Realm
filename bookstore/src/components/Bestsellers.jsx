import React, { useState, useEffect } from "react";
import "../styles/Bestsellers.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { useCart } from "../context/CartContext"; // Import CartContext
import { Link } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { FaTabletAlt, FaBook, FaTag, FaLock } from "react-icons/fa"; // React icons used here

export default function BestSellersData() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookKeys = [
          "okVdEAAAQBAJ", "GynbBQAAQBAJ", "0QwLEAAAQBAJ", "lFhbDwAAQBAJ",
          "2mn6DwAAQBAJ", "xQmFBAAAQBAJ", "85nrCgAAQBAJ", "i3jmEAAAQBAJ"
        ]; // Added all the product keys
        const fetchedBooks = await Promise.all(
          bookKeys.map(async (key) => {
            const response = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${key}`
            );
            return response.json();
          })
        );
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);
  const { addToCart } = useCart(); // Get addToCart function from CartContext
  const authors = [
    {
      name: "Colleen Hoover",
      image: './colleen.jpg',
      description: "Author of bestselling contemporary romance novels.",
      link: '/shop/colleen-hoover'
    },
    {
      name: "Sarah J. Maas",
      image: './sarah.jpg',
      description: "Known for her fantasy series like 'Throne of Glass'.",
      link: '/shop/sarah-j-maas'
    },
    {
      name: "Stephen King",
      image: './stephan.jpg',
      description: "Renowned author of horror and suspense novels.",
      link: '/shop/stephen-king'
    },
    {
      name: "J.K. Rowling",
      image: './jk.jpg',
      description: "Creator of the Harry Potter series.",
      link: '/shop/jk-rowling'
    }
  ];
  
  const handleAddToCart = (book) => {
    if (!book) return; // Ensure the book object exists
  
    addToCart({
      book_id: book.id || book.volumeInfo?.id, // Use volumeInfo.id if available
      title: book.volumeInfo?.title || "Unknown Title", // Safely access title
      price: book.saleInfo?.retailPrice?.amount || 0, // Use the price if available
      quantity: 1, // Assuming 1 item added at a time
      imageLinks: book.volumeInfo?.imageLinks || {}, // Ensure imageLinks are included
    });
  
    alert(`${book.volumeInfo?.title || "Unknown Title"} has been added to the cart!`);
  };


  return (
    <>
      {/* Bestsellers Section */}
      <div className="bestsellers-container">
        {/* Heading Section */}
        <div className="heading-section">
          <div className="line"></div>
          <div className="diamonds">
            <span className="small-diamond">◇</span>
            <span className="large-diamond">◆</span>
            <span className="small-diamond">◇</span>
          </div>
          <div className="text">BestSellers of 2024</div>
          <div className="diamonds">
            <span className="small-diamond">◇</span>
            <span className="large-diamond">◆</span>
            <span className="small-diamond">◇</span>
          </div>
          <div className="line"></div>
        </div>

        {/* Swiper Section */}
        <Swiper
          spaceBetween={50}
          slidesPerView={4}
          loop={true}
          modules={[Navigation, Pagination]}
          pagination={{
            el: ".swiper-pagination",
            clickable: true
          }}
          navigation={{
            prevEl: ".button-prev-slide",
            nextEl: ".button-next-slide"
          }}
        >
          {books.map((book, index) => {
            const volumeInfo = book.volumeInfo || {}; // Safe access to volumeInfo
            const { title, authors, imageLinks, infoLink } = volumeInfo;

            return (
              <SwiperSlide key={index}>
                <div className="bestsellerbook-card">
                  <div className="bestsellerbook-box">
                    <a href={infoLink} target="_blank" rel="noopener noreferrer">
                      {imageLinks ? (
                        <img
                          src={imageLinks?.thumbnail}
                          alt={`Cover of ${title}`}
                          className="bestseller-image"
                        />
                      ) : (
                        <div className="no-image">No Image Available</div>
                      )}
                    </a>
                  </div>
                  <div className="bestsellersbook-info">
                    <h4>{title || "Unknown Title"}</h4> {/* Default text for missing title */}
                    <div>
                      <small>{authors?.join(", ") || "Unknown Author"}</small>
                    </div>
                    <button type="button" className="addtocart"
                     onClick={() => handleAddToCart(book)}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="bestseller-border"></div>
        <div className="swiper-pagination"></div>

        <div className="swiper-navigation">
          <button className="button-prev-slide">
            <IoArrowBack />
          </button>
          <button className="button-next-slide">
            <IoArrowForward />
          </button>
        </div>

        <Link to="/shop" className="btn bestseller-btn">
          View All Products <BsArrowReturnRight />
        </Link>
      </div>

      {/* Authors of the Month Section */}
      <div className="authors-section">
        <h2>✨ Authors of the Month ✨</h2>
        <p>
          Celebrate literary brilliance with our Authors of the Month! Each month, we spotlight talented writers
          whose stories inspire, captivate, and resonate with readers. <br />
          Check out their books to immerse yourself in the worlds they've created.
        </p>
        <div className="authors-grid">
          {authors.map((author, index) => (
            <Link to={author.link} key={index} className="author-card-link">
              <div className="author-card">
                <img src={author.image} alt={author.name} className="author-image" />
                <h3>{author.name}</h3>
                <p>{author.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="benefits-section">
        <div className="benefit">
          <FaTabletAlt className="benefit-icon" />
          <div className="benefit-text">
            <h4>Read Anywhere</h4>
            <p>Enjoy your eBooks on any device—mobile, tablet, or desktop</p>
          </div>
        </div>
        <div className="benefit">
          <FaBook className="benefit-icon" />
          <div className="benefit-text">
            <h4>Wide Selection</h4>
            <p>Choose from thousands of eBooks across various genres.</p>
          </div>
        </div>
        <div className="benefit">
          <FaTag className="benefit-icon" />
          <div className="benefit-text">
            <h4>Amazing Value</h4>
            <p>We offer competitive prices</p>
          </div>
        </div>
        <div className="benefit">
          <FaLock className="benefit-icon" />
          <div className="benefit-text">
            <h4>Safe Payment</h4>
            <p>100% secure payment</p>
          </div>
        </div>
      </div>
    </>
  );
}
