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

          <div id="experience" style={{
            scrollMarginTop: "100px", position: "relative",
            // border: "1px solid black"
            width: "100%"
          }}>
            <div style={{ filter: "url(#grainy)", pointerEvents: "none", opacity: 0.22, position: "absolute", width: "100%", height: "100%", zIndex: 100 }}></div>

            <h2>Work Experience</h2>

            <div className="job">
              <div className="job-text" style={{ margin: "20px" }}>
                <div className="header">
                  <div className="title-and-date">
                    <h3 className="title">Full Stack Developer</h3>
                    <p className="date"><strong>Apr 2024 - Present</strong></p>
                  </div>
                  <div className="company-and-location">
                    <p className="company">Peak HydroMet Solutions</p>
                    <p className="location">British Columbia, Canada</p>
                  </div>
                </div>

                <ul>
                  <li>
                    <strong>Soft Skills:</strong> Engaged in in-person product improvement discussions with clients and worked as the sole developer for the business.
                  </li>
                  <li>
                    <strong>Data Processing:</strong> Parsed JSON, XML, and CSV data using Python and utilized multithreading to optimize data curation speeds.
                  </li>
                  <li>
                    <strong>Front End:</strong> Built custom widgets for ThingsBoard, implemented features using HTML, CSS, and JavaScript, optimized the ECharts.js charting library through multithreading, and provided UX design recommendations.
                  </li>
                  <li>
                    <strong>Back End:</strong> Developed backend solutions using Node-RED, researched optimal APIs through documentation reviews, implemented email subscriptions using SendGrid and AWS Lambda/EC2, integrated MongoDB with Node.js, and worked with MQTT protocols.
                  </li>
                </ul>
              </div>

              <div className="MultiTimeSeriesEditor-container" style={{
                width: "800px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "20px"
              }}>
                <MultiTimeSeriesEditor />
              </div>
            </div>

          </div>


          {/* </div> */}
        </div >
      </main >

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
