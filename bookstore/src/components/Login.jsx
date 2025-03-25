import React, { useState } from "react";
import "../styles/Login.css";
import axios from "axios";
import logo from "/logo.png";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/login", formData);
      const { email, firstname, lastname, token } = response.data.user;
      
      localStorage.setItem("token", token);
      localStorage.setItem("firstname", firstname);
      
      alert(`Welcome, ${firstname}`);
      navigate("/udashboard");
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "An error occurred during login",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <button className="back-button" onClick={handleBackClick}>
          <IoArrowBack size={24} />
        </button>
        <div className="logo">
          <img src={logo} alt="Book Realm Logo" />
        </div>
      </div>

      <div className="loginheader-container">
        <div className="line"></div>
        <div className="diamonds">
          <span className="small-diamond">◇</span>
          <span className="large-diamond">◆</span>
          <span className="small-diamond">◇</span>
        </div>
        <div className="text">LOGIN</div>
        <div className="diamonds">
          <span className="small-diamond">◇</span>
          <span className="large-diamond">◆</span>
          <span className="small-diamond">◇</span>
        </div>
        <div className="line"></div>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
        </div>

        {errors.form && <div className="error-text">{errors.form}</div>}

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Logging in..." : "LOGIN"}
        </button>

        <div className="line-one"></div>
        <div className="text">Don't have an account?</div>
        <button type="button" className="loginbutton" onClick={() => navigate("/register")}>
          SIGNUP
        </button>
      </form>
    </div>
  );
};

export default Login;
