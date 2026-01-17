import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

const TopNavbar = () => {
  const menuItems = [
    { name: "About", target: "about" },
    { name: "Need Help?", target: "helpline" }, // 🔥 replaced Blog
    { name: "FAQ", target: "faq" },
    { name: "Contacts", target: "contacts" },
  ];

  const socialIcons = [
    { name: "FB", icon: <FaFacebookF /> },
    { name: "TW", icon: <FaTwitter /> },
    { name: "YT", icon: <FaYoutube /> },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-4 left-0 w-full z-50 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/icon.svg" // or png if you want
            alt="Trunki logo"
            className="w-8 h-8 select-none"
          />

          <h1 className="text-3xl walter-turncoat-regular select-none text-stroke-pink">
            Trunki
          </h1>
        </div>

        {/* Center Menu (Home only) */}
        {location.pathname === "/" && (
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

        {/* Right: Social Icons (Home only) */}
        {location.pathname === "/" && (
          <div className="flex gap-2">
            {socialIcons.map((item) => (
              <button
                key={item.name}
                className={`rounded-full shadow-sm transition duration-300
                            flex items-center justify-center
                  ${
                    item.name === "YT"
                      ? "bg-red-600 text-white px-4 py-2 hover:bg-red-700"
                      : "bg-white/10 text-white px-3 py-2 hover:bg-white/20"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavbar;
