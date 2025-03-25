import React, { useState } from "react";
import footerLogo from "/logo.png";
import paymentImage from "/payment.png";
import { FaFacebook, FaYoutube, FaLinkedin, FaGithub, FaInstagram, FaTwitterSquare } from "react-icons/fa";

const Footer = () => {
  const [emailInfo, setEmailInfo] = useState("");
  const [subscription, setSubscription] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const emailValidation = () => {
    return String(emailInfo)
      .toLowerCase()
      .match(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/);
  };

  const handleSubscription = () => {
    if (emailInfo === "") {
      setErrMsg("Please provide an Email!");
    } else if (!emailValidation(emailInfo)) {
      setErrMsg("Please provide a valid Email!");
    } else {
      setSubscription(true);
      setErrMsg("");
      setEmailInfo("");
    }
  };

  return (
    <div className="w-full bg-[#001529] py-20">
      <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 px-4 gap-10">
        {/* About Section */}
        <div className="col-span-2">
          <img src={footerLogo} alt="Footer Logo" className="w-40 h-auto mb-4" />
          <h1 style={{ fontFamily: 'Pirata One', fontSize: 28, color: '#C39A1C'}}>More about Book Realm</h1>
          <p className="text-base text-white w-full xl:w-[80%]">
            Whether you're a fan of fantasy or classics, Book Realm is the perfect bookstore for you. Dive into your personal eLibrary and enjoy books anytime, anywhere!
          </p>
          <div className="flex items-center gap-2 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <div className="w-7 h-7 bg-primeColor text-gray-100 rounded-full flex justify-center items-center hover:bg-[#C39A1C] duration-300">
                <FaFacebook />
              </div>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <div className="w-7 h-7 bg-primeColor text-gray-100 rounded-full flex justify-center items-center hover:bg-[#C39A1C] duration-300">
                <FaYoutube />
              </div>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <div className="w-7 h-7 bg-primeColor text-gray-100 rounded-full flex justify-center items-center hover:bg-[#C39A1C] duration-300">
                <FaInstagram />
              </div>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <div className="w-7 h-7 bg-primeColor text-gray-100 rounded-full flex justify-center items-center hover:bg-[#C39A1C] duration-300">
                <FaTwitterSquare />
              </div>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <div className="w-7 h-7 bg-primeColor text-gray-100 rounded-full flex justify-center items-center hover:bg-[#C39A1C] duration-300">
                <FaLinkedin />
              </div>
            </a>
          </div>
        </div>

      {/* Quick Links Section */}
<div>
  <h1 style={{ fontFamily: 'Pirata One', fontSize: 28, color: '#C39A1C' }}>Quick Links</h1>
  <ul className="flex flex-col gap-2">
    <li> <a  href="/about" className="text-base text-white hover:bg-[#C39A1C] hover:text-white hover:underline cursor-pointer">
        About Us </a> </li>
    <li> <a  href="/shop" 
        className="text-base text-white hover:bg-[#C39A1C] hover:text-white hover:underline cursor-pointer">
        Shop
      </a>
    </li>
    <li> <a  href="/" 
        className="text-base text-white hover:bg-[#C39A1C] hover:text-white hover:underline cursor-pointer">
        Privacy Policy
      </a>
    </li>
    <li> <a  href="/contactus" 
        className="text-base text-white hover:bg-[#C39A1C] hover:text-white hover:underline cursor-pointer">
       Contact us
      </a>
    </li>
    <li> <a  href="/register" 
        className="text-base text-white hover:bg-[#C39A1C] hover:text-white hover:underline cursor-pointer">
        Signup
      </a>
    </li>
  </ul>
</div>

{/* Quick Help Section */}
<div>
  <h1 style={{ fontFamily: 'Pirata One', fontSize: 28, color: '#C39A1C' }}>Quick Help</h1>
  <ul className="flex flex-col gap-2">
    <li className="text-base text-white hover:text-[#C39A1C] hover:underline cursor-pointer">Claim</li>
    <li className="text-base text-white hover:text-[#C39A1C] hover:underline cursor-pointer">Privacy Policy</li>
    <li className="text-base text-white hover:text-[#C39A1C] hover:underline cursor-pointer">Terms</li>
  </ul>
</div>


        {/* Newsletter Section */}
        <div className="col-span-2 flex flex-col items-center">
          <h1 style={{ fontFamily: 'Pirata One', fontSize: 28, color: '#C39A1C' }}>Subscribe to our Newsletter</h1>
          <p className="text-center text-white mb-3">Sign up for our latest news and offers:</p>
          {subscription ? (
            <p className="text-green-600 font-semibold">Subscribed Successfully!</p>
          ) : (
            <div className="flex flex-col w-full items-center gap-4">
              <div className="flex w-full items-center gap-2">
                <input
                  type="email"
                  value={emailInfo}
                  onChange={(e) => setEmailInfo(e.target.value)}
                  placeholder="Your email address..."
                  className="flex-1 h-12 border-b border-gray-400 bg-transparent px-4 text-lg outline-none"
                />
                <button
                  onClick={handleSubscription}
                  className="bg-white text-lightText w-32 h-10 hover:bg-black hover:text-white duration-300">
                  Subscribe
                </button>
              </div>
              {errMsg && <p className="text-red-600 text-sm font-semibold">{errMsg}</p>}
              <img src={paymentImage} alt="Payment Methods" className="mt-4" />
            </div>
          )}
        </div>
      </div>
      <div className="w-full bg-[#001529] group">
  <div className="max-w-container mx-auto flex justify-center items-center text-center mb-0 pb-0">
    <p className="text-titleFont font-normal text-white duration-200 text-sm">
      Copyright 2024 | BookRealm | All Rights Reserved |
      <span className="ml-1 font-medium group-hover:text-primeColor">
        Powered by BookRealm.com
      </span>
    </p>
  </div>
</div>
    </div>
    
  );
};

export default Footer;
