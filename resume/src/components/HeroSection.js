import React from "react";
import "./HeroSection.css"; // For styling
import selfie from "../assets/selfie-mirror-small.jpg";

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* <div style={{ position: "absolute", pointerEvents: "none", width: "100%", opacity: 0.22, height: "100%", filter: "url(#grainy)" }}></div> */}
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
