import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import "../styles/ContactForm.css";
import { GrInstagram } from "react-icons/gr";
import { AiOutlineYoutube } from "react-icons/ai";
import axios from "axios";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/send-email", formData);
      alert("Your message has been sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send your message. Please try again.");
    }
  };
  return (
    <div className="contact-container">
      <div className="contact-form">
        <h1>Contact Us</h1>
        <p>
          Required fields are marked *
        </p>

        <br/>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name*</label>
              <input
                type="text"
                name="name"
                className="contactform-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone*</label>
              <input
                type="text"
                name="phone"
                className="contactform-input"
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              name="email"
              className="contactform-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Let Us Know What You Need</label>
            <textarea
              placeholder="Write your message here"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            SUBMIT <span>&rarr;</span>
          </button>
        </form>
      </div>

      <div className="contact-info">
        <h3>Address</h3>
        <p>Dubai, UAE</p>

        <h3>Information</h3>
        <p>+971-56-545-0135</p>
        <p>bookrealm@contact.com</p>

        <h3>Follow us</h3>
        <div className="social-icons">
          <a href="#">
          <FaFacebook />
          </a>
          <a href="#">
            <GrInstagram />
          </a>
          <a href="#">
            <AiOutlineYoutube />
          </a>
        </div>

        <h3>Working Hours</h3>
        <p>Open: 8:00AM – Close: 18:00PM</p>
        <p>Saturday – Sunday: Close</p>
      </div>
    </div>
  );
};

export default ContactForm;