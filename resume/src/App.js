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

import mouseImg1 from "./assets/MouseMirage-img1.png"
import mouseImg2 from "./assets/MouseMirage-img2.png"

const App = () => {
  const [showText, setShowText] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const videoRef = useRef(null);

  const handsButton = {
    selectedIcon: handsIcon,
    text: "Hands<br>Detector",
    link: "https://jaredtweed.github.io/hands/",
    shadow: "var(--neumorphic-shadow)",
    color: "transparent",
    textColor: "var(--text-color)"
  };

  const troublemakerButton = {
    selectedIcon: troublemakerIcon,
    text: "Troublemaker<br>Reporter",
    link: "https://jaredtweed.github.io/TroublemakerReporter/",
    shadow: "var(--neumorphic-shadow)",
    color: "transparent",
    textColor: "var(--text-color)"
  };

  const ttqbcButton = {
    selectedIcon: ttqbcIcon,
    text: "Text To Question<br>Bank Converter",
    link: "https://jaredtweed.github.io/TextToQuestionBankOnline/",
    shadow: "var(--neumorphic-shadow)",
    color: "transparent",
    textColor: "var(--text-color)"
  };

  const bookingsButton = {
    selectedIcon: tetrisbookingIcon,
    text: "Appointment<br>Booker",
    link: "https://jaredtweed.github.io/tetrisbooking/",
    shadow: "var(--neumorphic-shadow)",
    color: "transparent",
    textColor: "var(--text-color)"
  };

  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        fontFamily: "Poppins, sans-serif",
        color: "#fff",
        textAlign: "center",
      }}
    >

      <Navbar className="navbar" />

      <main>

        <div style={{
          fontFamily: "Poppins, sans-serif",
          display: "flex", flexDirection: "column", alignItems: "center", position: "relative"
        }}>

          <HeroSection />


          <div id="experience" className="section">
            <div style={{ filter: "url(#grainy)", pointerEvents: "none", opacity: 0.22, position: "absolute", width: "100%", height: "100%", zIndex: 100 }}></div>
            <h2>Work Experience</h2>
            <div className="job">
              <div className="job-text">
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
                  <li><strong>Soft Skills:</strong> Engaged in in-person product improvement discussions with clients and worked as the sole developer for the business.</li>
                  <li><strong>Data Processing:</strong> Parsed JSON, XML, and CSV data using Python and utilized multithreading to optimize data curation speeds.</li>
                  <li><strong>Front End:</strong> Built custom widgets for ThingsBoard, implemented features using HTML, CSS, and JavaScript, optimized the ECharts.js charting library through multithreading, and provided UX design recommendations.</li>
                  <li><strong>Back End:</strong> Developed backend solutions using Node-RED, researched optimal APIs through documentation reviews, implemented email subscriptions using SendGrid and AWS Lambda/EC2, integrated MongoDB with Node.js, and worked with MQTT protocols.</li>
                </ul>
              </div>

              <div className="MultiTimeSeriesEditor-container">
                <MultiTimeSeriesEditor />
              </div>
            </div>
          </div>





          <div id="projects" className="section">
            <h2>Projects</h2>
            <h3>Websites</h3>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <AnimatedButton settings={handsButton} />
              <AnimatedButton settings={bookingsButton} />
              <AnimatedButton settings={ttqbcButton} />
              <AnimatedButton settings={troublemakerButton} />
            </div>
            {/* <h3>Computer Vision</h3> */}
            <h3>Other Projects</h3>
            <div className="job project neumorphic">
              <div className="job-text project-text">
                <div className="header">
                  <div className="title-and-date">
                    <h3 className="title">Java with Maven Game</h3>
                    <p className="date"><strong>Feb - Apr 2022</strong></p>
                  </div>
                  <div className="project-links">
                    <p className="company">More info: <a href="https://github.com/JaredTweed/MouseMirageGame">https://github.com/JaredTweed/MouseMirageGame</a></p>
                    {/* <p className="company"><a href="https://raw.githubusercontent.com/JaredTweed/MouseMirageGame/main/Mouse-Mirage.exe">Windows Download</a></p> */}
                  </div>
                </div>
                <ul>
                  <li>Led Mouse Mirage's Java development using Apache Maven and the Swing Framework.</li>
                  <li>Designed mechanics, including level progression, sound management, and UI navigation.</li>
                </ul>
              </div>
              <div className="project-images"><img src={mouseImg2} height="100%" /><img src={mouseImg1} height="100%" /></div>
            </div>
          </div>

          <div id="skills" className="section" >
            <div style={{ filter: "url(#grainy)", pointerEvents: "none", opacity: 0.22, position: "absolute", width: "100%", height: "100%", zIndex: 100 }}></div>
            <h2>Skills</h2>
            <h3>Technical Skills</h3>
            <div className="skill-block">
              <p><strong>Languages:</strong> Java, MATLAB, Python, C/C++, SQL (Postgres), HTML/CSS, Typescript, JavaScript, R, LaTeX</p>
              <p><strong>Frameworks:</strong> Angular, React, Node.js (Express.js), Java Swing, Flask</p>
              <p><strong>Developer Tools:</strong> Git, Google Cloud Platform, AWS Lambda & EC2, Visual Studio, Unity3D, Apache Maven</p>
              <p><strong>Libraries:</strong> NumPy, OpenCV, Detectron2, PyTorch, Regex, Tkinter, Websocket.io, MongoDB, Postman</p>
            </div>
            <h3>Transferable Soft Skills</h3>
            <div className="skill-block">
              <p>Displayed a strong work ethic when on Yukon diamond drilling rigs (up to 95 hour workweeks).</p>
              <p>Devoted years of volunteering and working with elementary school children.</p>
              <p>Excelled in culturally diverse workplaces.</p>
            </div>
          </div>

        </div >
      </main >

      <div id="contact" className="section" style={{ padding: "0px" }}>

        <footer style={{ padding: "20px", backgroundColor: "rgb(0, 0, 0)", color: "white", textAlign: "center", fontSize: "14px" }}>
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
