import React from "react";
import "./HeroSection.css"; // For styling
import selfie from "../assets/selfie-mirror-small.jpg";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* Text Content */}
        <div className="hero-text">
          <h1>
            Jared Tweed
            <br />
            <span>Full-Stack Developer</span>
          </h1>
          <a
            href="https://raw.githubusercontent.com/JaredTweed/jaredtweed/main/JaredTweed-Resume.pdf"
            target="_blank"
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
