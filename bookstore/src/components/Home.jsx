import React, { useRef } from 'react';
import BannerImg from '/shelf.png';
import '../styles/Home.css';
import { Link } from "react-router-dom";

const Home = () => {

  return (
    <div>
      {/* Hero Section */}
      <div className='hero-section'>
        <div className='md:w-1/2 w-full'>
          <h1 className="font-primary">
            <span>WHAT BOOK</span>
            <span>ARE</span>
            <span>YOU LOOKING FOR?</span>
          </h1>
          <Link to='/shop'>
          <button className='btn-primary'>Explore Now</button>
          </Link>
          
        </div>
        <div className='md:w-1/2 w-full'>
          <img src={BannerImg} alt="Book Banner" />
        </div>
      </div>

 <div className="banner">
 <div className="banner-background"></div>
 <div className="banner-content">
   <h1 className="quote">"Books are a uniquely portable magic."</h1>
   <p className="authorquote">- Stephen King</p>
 </div>
</div>
</div>
  );
};

export default Home;
