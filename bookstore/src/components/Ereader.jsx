import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import "../styles/Ereader.css";
import { ChromePicker } from "react-color";

const Ereader = () => {
  const { bookId } = useParams();
  const previewUrl = `https://books.google.com/books?id=${bookId}&printsec=frontcover&output=embed`;

  // No default mode selected
  const [isDarkMode, setIsDarkMode] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("transparent");

  // Background selections
  const [selectedImage, setSelectedImage] = useState("none");
  const [selectedVideo, setSelectedVideo] = useState("none");
  const [selectedCity, setSelectedCity] = useState("none");

  const [showPicker, setShowPicker] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const audioRef = useRef(null);

  const imageSources = {
    none: null,
    library: "../library.jpg",
    beach: "../beach.jpg",
    fireplace: "../fireplace.jpg",
  };

  const videoSources = {
    none: null,
    castle: "../castle.mp4",
    cafe: "../cafe.mp4",
    study: "../studyinrain.mp4",
    beach: "../beaches.mp4",
    hogwarts: "../hogwarts.mp4",
  };

  const cityTours = {
    none: null,
    Paris: "/videos/paris.mp4",
    Dubai: "../dubai.mp4",
    London: "../london.mp4",
  };

  const handleColorChange = (color) => {
    setBackgroundColor(color.hex);
  };

  const handleRemoveColor = () => {
    setBackgroundColor("transparent");
  };

  const playAmbiance = (sound) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (currentSound === sound) {
      setCurrentSound(null);
    } else {
      const newAudio = new Audio(sound);
      newAudio.play();
      audioRef.current = newAudio;
      setCurrentSound(sound);
    }
  };

  const toggleDarkMode = () => {
    if (isDarkMode === null) {
      setIsDarkMode(true); // Enable dark mode first
      setBackgroundColor("#000000");
    } else {
      setIsDarkMode(!isDarkMode);
      setBackgroundColor(isDarkMode ? "#FFE5B4" : "#000000");
    }
  };

  return (
    <div
      className="ereader-container"
      style={{
        backgroundColor:
          selectedImage === "none" ? backgroundColor : "transparent",
        color: isDarkMode === true ? "#FFFFFF" : isDarkMode === false ? "#000000" : "inherit",
      }}
    >
      {selectedImage !== "none" && (
        <img
          src={imageSources[selectedImage]}
          alt="Background"
          className="background-image"
        />
      )}

      {selectedVideo !== "none" && (
        <video src={videoSources[selectedVideo]} autoPlay loop className="background-video" />
      )}

      {selectedCity !== "none" && (
        <video src={cityTours[selectedCity]} autoPlay loop className="background-video" />
      )}

      <div className="nav-bar">
        <h2 className="nav-title">Book Realm Reader</h2>

        <div className="nav-section">
          <h3>Theme Mode</h3>
          <button onClick={toggleDarkMode} className="theme-toggle">
            {isDarkMode === null ? (
              <>Select Mode</>
            ) : isDarkMode ? (
              <>
                <FaMoon color="white" /> <span>Dark Mode</span>
              </>
            ) : (
              <>
                <FaSun color="#FFE5B4" /> <span>Light Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="nav-section">
          <h3>Choose a Background</h3>
          <select
            onChange={(e) => {
              setSelectedImage(e.target.value);
              setSelectedVideo("none");
              setSelectedCity("none");
            }}
            className="dropdown"
          >
            <option value="none">No Image</option>
            <option value="library">Library</option>
            <option value="beach">Beach</option>
            <option value="fireplace">Fireplace</option>
          </select>
        </div>

        <div className="nav-section">
          <h3>Pick Your Ambient Video</h3>
          <select
            onChange={(e) => {
              setSelectedVideo(e.target.value);
              setSelectedImage("none");
              setSelectedCity("none");
            }}
            className="dropdown"
          >
            <option value="none">No Video</option>
            <option value="castle">Castle</option>
            <option value="cafe">Cafe</option>
            <option value="study">Study</option>
            <option value="beach">Beach</option>
            <option value="hogwarts">Hogwarts</option>
          </select>
        </div>

        <div className="nav-section">
          <h3>Drive Around the City</h3>
          <select
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedImage("none");
              setSelectedVideo("none");
            }}
            className="dropdown"
          >
            <option value="none">No City</option>
            <option value="Paris">Paris</option>
            <option value="Dubai">Dubai</option>
            <option value="London">London</option>
          </select>
        </div>

        <div className="nav-section">
          <h3>Ambiance Music</h3>
          <button className="ambiance-button" onClick={() => playAmbiance("../lightrain.mp3")}>Light Rain</button>
          <button className="ambiance-button" onClick={() => playAmbiance("../librarystudy.mp3")}>Library Study</button>
          <button className="ambiance-button" onClick={() => playAmbiance("../ocean.mp3")}>Beachy</button>
          <button className="ambiance-button" onClick={() => playAmbiance("../fireplacesound.mp3")}>Fireplace</button>
        </div>

        <div className="nav-section">
          <h3>Pick Background Color</h3>
          <button className="color-picker-toggle" onClick={() => setShowPicker(!showPicker)}>
            {showPicker ? "Close Color Picker" : "Open Color Picker"}
          </button>
          {showPicker && <ChromePicker color={backgroundColor} onChange={handleColorChange} />}
        </div>

        <div className="nav-section">
          <button onClick={handleRemoveColor} className="ambiance-button">
            Remove Background Color
          </button>
        </div>
      </div>

      <iframe src={previewUrl} title="Book Preview" className="book-preview-frame" />
    </div>
  );
};

export default Ereader;
