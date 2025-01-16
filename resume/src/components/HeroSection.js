import React, { useEffect, useState } from "react";
import "./HeroSection.css"; // For styling
import selfie from "../assets/selfie-mirror-small.jpg";


const HeroSection = () => {
  // State for managing the current theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply the theme when it changes
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <section className="hero-section">
      {/* <div style={{ position: "absolute", pointerEvents: "none", width: "100%", opacity: 0.22, height: "100%", filter: "url(#grainy)" }}></div> */}
      <button className="toggle-button" onClick={toggleTheme}>
        {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      <div className="hero-content">
        {/* Text Content */}
        <div className="hero-text">
          <h1>
            Jared Tweed
            <br />
            <span>Full-Stack Developer</span>
          </h1>
          <p>
            BSc Computer Science, Mathematics Minor
            <br />Simon Fraser University, Burnaby, BC
            {/* <br />Sep 2020 - Apr 2025 */}
          </p>
          <a
            href="https://raw.githubusercontent.com/JaredTweed/jaredtweed/main/JaredTweed-Resume.pdf"
            // href="/resume.pdf"
            target="_self"
            rel="noopener noreferrer"
            className="hero-resume-link"
          >
            View My Resume
          </a>
        </div>
        {/* Selfie */}
        <div className="hero-image">
          <img src={selfie} alt="Jared Tweed" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
