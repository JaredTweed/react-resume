import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import AnimatedButton from "./components/AnimatedButton";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MultiTimeSeries from './components/MultiTimeSeries'
import MultiTimeSeriesEditor from './components/MultiTimeSeriesEditor'

import '@mdi/font/css/materialdesignicons.min.css'; // Import Material Design Icons CSS
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/700.css"; // Bold weight

import handsIcon from "./assets/hands.png";
import ttqbcIcon from "./assets/texttoquestion.png";
import troublemakerIcon from "./assets/troublemaker.jpg";
import tetrisbookingIcon from "./assets/tetrisbooking.png";
import tealBlackVideo from "./assets/teal-black.mp4"; // Import the video file
import background from "./assets/texture1.jpg";
import peakhydro from "./assets/work-experience.png";

const App = () => {
  const [showText, setShowText] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const videoRef = useRef(null);

  const handsButton = {
    selectedIcon: handsIcon,
    text: "Hands<br>Detector",
    link: "https://jaredtweed.github.io/hands/",
  };

  const troublemakerButton = {
    selectedIcon: troublemakerIcon,
    text: "Troublemaker<br>Reporter",
    link: "https://jaredtweed.github.io/TroublemakerReporter/",
  };

  const ttqbcButton = {
    selectedIcon: ttqbcIcon,
    text: "Text To Question<br>Bank Converter",
    link: "https://jaredtweed.github.io/TextToQuestionBankOnline/",
  };

  const bookingsButton = {
    selectedIcon: tetrisbookingIcon,
    text: "Appointment<br>Booker",
    link: "https://jaredtweed.github.io/tetrisbooking/",
  };

  const resumeButton = {
    selectedIcon: "mdi:download",
    iconSize: 60,
    fontSize: "25px",
    height: 50,
    width: 200,
    color: "#007070",
    text: "Resume",
    link: "https://raw.githubusercontent.com/JaredTweed/jaredtweed/main/JaredTweed-Resume.pdf",
  };


  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && !showText && video.duration - video.currentTime <= 1.5) {
      setShowText(true); // Trigger fade-in 1.5 seconds before the video ends
    }

    if (video && !showResume && video.duration - video.currentTime <= 0) {
      setShowResume(true); // Trigger fade-in when the video ends
    }
  };

  return (
    <div
      style={{
        // backgroundImage: `url(${background})`,
        backgroundColor: "#DAA06D",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        fontFamily: "Poppins, sans-serif",
        color: "#fff",
        textAlign: "center",
      }}
    >

      <Navbar />




      <main>

        <div style={{
          // height: "100vh",
          // padding: "10px",
          fontFamily: "Poppins, sans-serif",
          // margin: "10px", 
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", position: "relative"
        }}>

          <HeroSection />

          <div id="projects" style={{ scrollMarginTop: "100px" }}>
            <h2>Projects</h2>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <AnimatedButton settings={handsButton} />
              <AnimatedButton settings={bookingsButton} />
              <AnimatedButton settings={ttqbcButton} />
              <AnimatedButton settings={troublemakerButton} />
            </div>
          </div>

          <div id="experience" style={{ scrollMarginTop: "100px" }}>
            <h2>Work Experience</h2>

            <img src={peakhydro} style={{ maxWidth: "900px" }}></img>

            <div style={{
              // height: "400px", 
              width: "100%", display: "flex", // Enables flexbox
              justifyContent: "center", // Centers horizontally
              alignItems: "center", // Centers vertically 
              // border: "1px solid black"
            }}>
              {/* < MultiTimeSeries
              data={data}            // The multi-array of timeseries data
              dataKeys={dataKeys}    // Metadata (labels, color, decimals, etc.)
              settings={settings}    // Global widget configuration
              minTime={minTime}      // Earliest timestamp
              maxTime={maxTime}      // Latest timestamp
            /> */}
              <MultiTimeSeriesEditor />
            </div>
          </div>
        </div >
      </main >

      {/* <footer style={{ padding: "10px", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
        <p>&copy; 2025 Jared Tweed. All Rights Reserved.</p>
        <a href="mailto:jaredtwe@gmail.com" style={{ color: "white", textDecoration: "none" }}>
          Contact Me
        </a>
      </footer> */}
      <div id="contact" style={{ scrollMarginTop: "100px" }}>

        <footer style={{ padding: "20px", backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white", textAlign: "center", fontSize: "14px" }}>
          <p style={{ margin: "5px 0" }}>
            <a
              href="https://linkedin.com/in/jared-tweed"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", textDecoration: "underline", marginRight: "10px" }}
            >
              linkedin.com/in/jared-tweed
            </a>
            |
            <a
              href="https://github.com/JaredTweed"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", textDecoration: "underline", margin: "0 10px" }}
            >
              github.com/JaredTweed
            </a>
            |
            <a
              href="https://w.wiki/9JKw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", textDecoration: "underline", marginLeft: "10px" }}
            >
              Wikipedia Contributions
            </a>
          </p>
          <p style={{ margin: "5px 0" }}>
            778-979-0126 | <a href="mailto:jaredtwe@gmail.com" style={{ color: "white", textDecoration: "underline" }}>jaredtwe@gmail.com</a>
          </p>
          <p style={{ margin: "15px 0 0" }}>&copy; 2025 Jared Tweed. All Rights Reserved.</p>
        </footer>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div >
  );
};

export default App;
