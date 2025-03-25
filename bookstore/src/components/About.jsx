import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import "../styles/About.css";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { GiBookshelf } from "react-icons/gi";
import { FaBookReader } from "react-icons/fa";


const About = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const questions = [
    {
      id: 1,
      questions: "What is Book Realm?",
      answer: "BookRealm is a digital bookstore and e-library where you can explore, purchase, and read your favorite books with a personalized reading experience."
    },
    {
      id: 2,
      questions: "Do I need an account to buy books?",
      answer: "Yes! You need to sign up on our platform to purchase and access your books in the e-library."
    },
    {
      id: 3,
      questions: "Is my payment information secure?",
      answer: "Absolutely! We use industry-standard encryption to ensure all your payment details are safe and secure."
    },
    {
      id: 4,
      questions: "How do I access my purchased books?",
      answer: "Once you buy a book, it’s immediately available in your BookRealm e-library. Just log in to your account and start reading."
    },
    {
      id: 5,
      questions: "Can I customize my reading experience?",
      answer: "Yes! Our e-reader offers features like themes (dark mode, sepia, etc.), and even ambient backgrounds to enhance your reading experience."
    },
    {
      id: 6,
      questions: "What should I do if the e-library isn’t working?",
      answer: "Try refreshing your browser or restarting the app. If the issue persists, contact our support team for assistance."
    }
  ];

  return (
    <>
      {/* About Section */}
      <div className="about-container">
        <h1 className="about-title">ABOUT BOOKREALM</h1>
        <div className="about-content">
          <div className="about-text">
            <p>
              Welcome to Book Realm, a haven for book lovers and curious minds alike.
              Founded with a passion for stories that inspire, educate, and entertain,
              Book Realm is more than just a bookstore—Book Realm offers a seamless
              blend of both worlds.
            </p>
          </div>
          <div className="about-image">
            <img src="aboutpg.png" alt="Books on a shelf" className="image" />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2 className="how-title">HOW IT WORKS</h2>
        <div className="how-steps">
          <div className="step">
            <GiBookshelf className="step-icon" />
            <h3 className="step-title">
              CHOOSE <br /> A BOOK
            </h3>
            <p className="step-description">
              Explore a diverse collection of books across genres and find your next great read.
            </p>
          </div>
          <div className="step">
            <HiOutlineShoppingCart className="step-icon" />
            <h3 className="step-title">
              PURCHASE <br /> YOUR FAVORITE BOOK
            </h3>
            <p className="step-description">
              Securely buy your chosen book and unlock a world of knowledge and stories.
            </p>
          </div>
          <div className="step">
            <FaBookReader className="step-icon" />
            <h3 className="step-title">
              READ IN OUR <br /> E-LIBRARY
            </h3>
            <p className="step-description">
              Enjoy your book in our immersive e-library with customizable reading experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="mission-container">
        <h1 className="mission-title">OUR MISSION</h1>
        <div className="mission-content">
          <div className="mission-image">
            <img src="../study.jpg" alt="Person reading in a cozy environment" className="image" />
          </div>
          <div className="mission-text">
            <p>
              At BookRealm, our mission is to make reading an enjoyable,
              immersive, and personalized experience for everyone. We believe
              that books have the power to inspire, educate, and entertain, and
              we’re committed to bringing that magic to life through our
              innovative e-reader.
            </p>
            <p>
              Let us help you rediscover the joy of reading, one story at a
              time.
            </p>
          </div>
        </div>
      </div>

     {/* FAQ Section */}
     <div className="w-screen h-screen flex justify-center items-center" style={{ background: "url('../ubg.jpg') no-repeat center center / cover"
  }}>
  <div className="w-[89%] m-auto max-w-[1400px] p-8 rounded-lg shadow-md">
  <h2 className="text-2xl mb-6 font-semibold flex justify-center items-center" style={{ fontFamily: 'wizard',color: '#ffdb58', fontSize: '60px', textAlign: 'center', }}>
     Frequently Asked Questions </h2>
    {questions.map((q) => (
      <div key={q.id} className="mb-4 last:mb-0">
        <button
          className="w-full text-left text-xl focus:outline-none p-4 rounded-lg shadow-md flex justify-between items-center"
          style={{ backgroundColor: '#C39A1C', color: 'black' }}
          onClick={() => setActiveQuestion(activeQuestion === q.id ? null : q.id)}>
          {q.questions}
          {activeQuestion === q.id ? <FaMinusCircle /> : <FaPlusCircle />}
        </button>
        <AnimatePresence>
          {activeQuestion === q.id && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} className="mt-2 ml-4"  style={{ color: 'black' }}>
              <p style={{ color: 'white' }}>{q.answer}</p>  </motion.div> )}
        </AnimatePresence>
      </div>
    ))}
  </div>
</div>
    </>
  );
};

export default About;