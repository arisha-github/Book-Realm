import React, { useState } from "react";
import "../styles/Register.css";
import axios from "axios";
import logo from "/logo.png";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    dob: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false); // Toggle OTP field
  const [isFormVisible, setIsFormVisible] = useState(true); // Toggle form visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");

      if (!showOtpField) {
        // Step 1: Send registration data and request OTP
        const response = await axios.post("http://localhost:5000/register", formData);
        setMessage("OTP sent to your email. Please check your inbox.");
        setShowOtpField(true); // Show OTP field
        setIsFormVisible(false); // Hide the form
      } else {
        // Step 2: Verify OTP
        const response = await axios.post("http://localhost:5000/verify-otp", {
          ...formData,
          otp,
        });
        setMessage("Registration successful! You can now log in.");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong. Please try again.");
    }
  };

  const handleChangeEmail = () => {
    setIsFormVisible(true); // Show the form again
    setShowOtpField(false); // Hide the OTP field
    setOtp(""); // Clear the OTP input
    setMessage(""); // Clear any messages
    setError(""); // Clear any errors
  };

  return (
    <div className="signup-container">
      {/* Header with Logo and Back Button */}
      <div className="header">
        <button className="back-button" onClick={handleBackClick}>
          <IoArrowBack size={24} />
        </button>
        <div className="logo">
          <img src={logo} alt="Book Realm Logo" />
        </div>
      </div>

      {/* Header Section */}
      <div className="register-container">
        <div className="line"></div>
        <div className="diamonds">
          <span className="small-diamond">◇</span>
          <span className="large-diamond">◆</span>
          <span className="small-diamond">◇</span>
        </div>
        <div className="text">Signup</div>
        <div className="diamonds">
          <span className="small-diamond">◇</span>
          <span className="large-diamond">◆</span>
          <span className="small-diamond">◇</span>
        </div>
        <div className="line"></div>
      </div>

      {/* Signup Form */}
      <form className="signup-form" onSubmit={handleSubmit}>
        {isFormVisible ? (
          <>
            <div className="form-group">
              <label htmlFor="dob">DATE OF BIRTH</label>
              <input type="date" id="dob" name="dob" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="email">EMAIL ADDRESS</label>
              <input
                className="typetext"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">PASSWORD</label>
              <div className="password-container">
                <input
                  className="typetext"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <div className="name-inputs">
                <div>
                  <label htmlFor="firstName">FIRST NAME</label>
                  <input
                    type="text"
                    className="typetext"
                    onChange={handleChange}
                    id="firstName"
                    name="firstname"
                    value={formData.firstname}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName">LAST NAME</label>
                  <input
                    type="text"
                    className="typetext"
                    value={formData.lastname}
                    onChange={handleChange}
                    id="lastName"
                    name="lastname"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="terms">
              <p>
                By proceeding, you agree to our <a href="#">Terms of Use</a> and
                acknowledge our <a href="#">Privacy Policy</a>.
              </p>
            </div>

            {/* Sign-Up Button */}
            <button type="submit" className="signup-button">
              SIGN UP
            </button>
          </>
        ) : (
          <>
            {/* OTP Field */}
            {showOtpField && (
              <div className="form-group">
                <label htmlFor="otp">ENTER OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP sent to your email"
                  required
                />
              </div>
            )}

            {/* Verify OTP Button */}
            <button type="submit" className="signup-button">
              VERIFY OTP
            </button>

            {/* Change Email Button */}
            <button
              type="button"
              className="change-email-button"
              onClick={handleChangeEmail}
            >
              Change Email
            </button>
          </>
        )}

        {/* Feedback Messages */}
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Line */}
        <div className="line-one"></div>
        <div className="text">Already have an account?</div>

        {/* Login Button */}
        <button
          type="button"
          className="loginbutton"
          onClick={() => navigate("/login")}
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Register;