import React from "react";
import "./HeroSection.css";
import selfie from "../assets/selfie.jpeg"
import selfieFront from "../assets/selfie-front.png"

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Selfie Image */}
      <div className="hero-image">
        <img src={selfie} alt="Jared Tweed" />
        <img src={selfieFront} style={{ zIndex: 6, pointerEvents: "none" }} alt="Jared Tweed" />
      </div>

      {/* Content Overlay */}
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            Jared Tweed
            <br />
            <span>Full-Stack Developer</span>
          </h1>
          {/* <a
            href="https://raw.githubusercontent.com/JaredTweed/jaredtweed/main/JaredTweed-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-resume-link"
            style={{ zIndex: 7 }}
          >
            View My Resume
          </a> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
