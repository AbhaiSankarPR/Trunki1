// src/components/LandingPage.jsx
import React from "react";
import { useNavigate } from 'react-router-dom';
import MascotVideo from "../assets/video1.mp4"; // you can also use an image if you want
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";


// Dummy data for sections
const aboutContent =
  "Trunki is a fun and interactive learning app for kids. Our mission is to make learning joyful and engaging through playful games, stories, and activities.";
const blogPosts = [
  { title: "Learning through Play", date: "Jan 10, 2026" },
  { title: "Top 5 Educational Games", date: "Feb 5, 2026" },
  { title: "Why Kids Love Trunki", date: "Mar 3, 2026" },
];
const faqs = [
  {
    question: "What age group is Trunki for?",
    answer: "Trunki is designed for children aged 4-10.",
  },
  {
    question: "Can I use Trunki offline?",
    answer: "Yes! Many features work offline.",
  },
  {
    question: "Is it safe for kids?",
    answer: "Absolutely! No ads or unsafe content.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-pink-600 relative overflow-x-hidden scroll-smooth">

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-yellow-300 rounded-full opacity-30 animate-float-slow z-0"></div>
      <div className="absolute top-60 right-16 w-32 h-32 bg-purple-300 rounded-full opacity-20 animate-float-slow z-0"></div>
      <div className="absolute bottom-40 left-24 w-20 h-20 bg-green-300 rounded-full opacity-25 animate-float-slow z-0"></div>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 pt-24 md:pt-32 relative z-10"
      >
        {/* Video Section */}
        <div className="md:w-1/3 w-11/12 mb-12 md:mb-0 md:mr-12 fade-in z-10 rounded-3xl overflow-hidden shadow-2xl">
          <video
            src={MascotVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>

        {/* Text Section */}
        <div className="text-center md:text-left md:w-1/2 fade-in z-10">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 animate-fadeIn leading-tight">
            Welcome to Trunki!
          </h1>
          <p className="text-white mb-8 max-w-lg text-xl md:text-2xl animate-fadeIn delay-150">
            Fun learning games and activities that make your child happy and
            smart.
          </p>
          <button   onClick={() => navigate('/login')} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-8 py-4 rounded-full shadow-xl text-xl md:text-2xl transition transform hover:scale-105 animate-fadeIn delay-300">
            Get Started
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-20 bg-white relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-pink-600 mb-12">
          About Trunki
        </h2>
        <p className="text-center text-xl max-w-3xl mx-auto">{aboutContent}</p>
      </section>

      {/* Blog Section */}
      <section id="blog" className="w-full py-20 bg-pink-200 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-pink-600 mb-12">
          Blog
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition transform hover:scale-105 text-center"
            >
              <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600">{post.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-20 bg-white relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-pink-600 mb-12">
          FAQ
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-pink-100 rounded-3xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-2">{faq.question}</h3>
              <p className="text-lg">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacts Section */}
      <section
        id="contacts"
        className="w-full py-20 bg-pink-600 relative z-10 text-white"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
          Contact Us
        </h2>
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xl">Email: contact@trunkiapp.com</p>
          <p className="text-xl">Phone: +91 98765 43210</p>
          <p className="text-xl">Address: 123 Trunki Lane, Fun City</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-pink-800 text-white py-10 mt-12 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-6">
          <div className="text-lg md:text-xl font-bold">Trunki © 2026</div>
          <div className="flex gap-4">
  {[
    { name: "FB", icon: <FaFacebookF /> },
    { name: "TW", icon: <FaTwitter /> },
    { name: "YT", icon: <FaYoutube /> },
  ].map((item) => (
    <button
      key={item.name}
      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 
                 text-base transition flex items-center justify-center"
      aria-label={item.name}
    >
      <span className="text-lg">{item.icon}</span>
    </button>
  ))}
</div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
