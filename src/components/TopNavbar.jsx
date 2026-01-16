import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TopNavbar = () => {
  const menuItems = [
    { name: 'About', target: 'about' },
    { name: 'Blog', target: 'blog' },
    { name: 'FAQ', target: 'faq' },
    { name: 'Contacts', target: 'contacts' },
  ];

  const socialIcons = ['FB', 'TW', 'YT'];

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

 return (
  <header className="fixed top-4 left-0 w-full z-50 px-6">
    <div className="max-w-7xl mx-auto flex items-center justify-between">

      {/* Left: App Name */}
      <div
        className="cursor-pointer"
        onClick={() => navigate('/')}
      >
        <h1 className="text-2xl font-extrabold select-none text-stroke-pink">
          Trunki
        </h1>
      </div>

      {location.pathname === '/' && (
        <nav className="flex gap-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.target)}
              className="text-white font-semibold px-6 py-3 rounded-full 
                         bg-pink-600/90 hover:bg-pink-600/60 text-lg 
                         shadow-md hover:scale-105 transition duration-300"
            >
              {item.name}
            </button>
          ))}
        </nav>
      )}

      {/* Right: Social Icons (only on home) */}
      {location.pathname === '/' && (
        <div className="flex gap-2">
          {socialIcons.map((icon) => (
            <button
              key={icon}
              className={`rounded-full shadow-sm transition duration-300 
                ${
                  icon === 'YT'
                    ? 'bg-red-600 text-white px-4 py-2 hover:bg-red-700'
                    : 'bg-white/10 text-white px-3 py-2 text-sm hover:bg-white/20'
                }`}
            >
              {icon}
            </button>
          ))}
        </div>
      )}

    </div>
  </header>
);

};

export default TopNavbar;
