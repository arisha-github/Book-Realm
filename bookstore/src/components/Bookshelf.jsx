import React from "react";
import "../styles/bookshelf.css";

const Bookshelf = () => {
  return (
    <div className="bookshelf">
      <div className="shelf">
        <div className="book" style={{ backgroundColor: "#ff6f61" }}>Book 1</div>
        <div className="book" style={{ backgroundColor: "#f7d154" }}>Book 2</div>
        <div className="book" style={{ backgroundColor: "#4db6ac" }}>Book 3</div>
      </div>
      <div className="shelf">
        <div className="book" style={{ backgroundColor: "#7986cb" }}>Book 4</div>
        <div className="book" style={{ backgroundColor: "#9575cd" }}>Book 5</div>
        <div className="book" style={{ backgroundColor: "#64b5f6" }}>Book 6</div>
      </div>
      <div className="shelf">
        <div className="book" style={{ backgroundColor: "#ff8a65" }}>Book 7</div>
        <div className="book" style={{ backgroundColor: "#a1887f" }}>Book 8</div>
        <div className="book" style={{ backgroundColor: "#81c784" }}>Book 9</div>
      </div>
    </div>
  );
};

export default Bookshelf;
