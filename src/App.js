import React, { useEffect } from "react";
import "./App.css";

import AnimatedButton from "./components/AnimatedButton";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MultiTimeSeriesEditor from './components/MultiTimeSeriesEditor'

import '@mdi/font/css/materialdesignicons.min.css'; // Import Material Design Icons CSS
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/700.css"; // Bold weight

import handsIcon from "./assets/hands.png";
import ttqbcIcon from "./assets/texttoquestion.png";
import troublemakerIcon from "./assets/troublemaker.jpg";
import tetrisbookingIcon from "./assets/tetrisbooking.png";
import graphtolatexIcon from "./assets/graphtolatex.png";
import sharedLensIcon from "./assets/shared-lens.png";

import mouseImg1 from "./assets/MouseMirage-img1.png";
import mouseImg2 from "./assets/MouseMirage-img2.png";
import panoramaImg1 from "./assets/Panorama-img1.png";
import panoramaImg2 from "./assets/Panorama-img2.png";
import softSkillYukon from "./assets/soft-skills-1.png";
import softSkillCoach from "./assets/soft-skills-2.jpg";

import linkIcon from "./assets/external-link.png"

const App = () => {
  useEffect(() => {
    const adjustImageDimensions = () => {
      const containers = document.querySelectorAll(".project-images");

      const referenceMeasurement = document.querySelectorAll(".reference-measurement");

      containers.forEach((container) => {
        // const images = container.querySelectorAll("img");
        const images = Array.from(container.querySelectorAll("img")).filter((img) => {
          // Include only images that are not hidden
          return window.getComputedStyle(img).display !== "none";
        });
        // const totalWidth = 700 // Desired total width of images
        const totalWidth = Math.min(window.innerWidth - 36, referenceMeasurement[0].offsetWidth - 20, 800);
        const gap = 10; // Space between images
        let totalAspectRatio = 0;

        const aspectRatios = Array.from(images).map((img) => {
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          totalAspectRatio += aspectRatio;
          return aspectRatio;
        });

        const availableWidth = totalWidth - (images.length - 1) * gap; // Account for gaps
        const commonHeight = availableWidth / totalAspectRatio;

        images.forEach((img, index) => {
          const width = aspectRatios[index] * commonHeight;
          img.style.width = `${width}px`;
          img.style.height = `${commonHeight}px`;
        });
      });
    };

    const handleResize = () => {
      adjustImageDimensions();
    };


    const handleImagesLoaded = () => {
      adjustImageDimensions();
    };

    // Wait for all images to load before adjusting dimensions
    const containers = document.querySelectorAll(".project-images");

    containers.forEach((container) => {
      const images = container.querySelectorAll("img");
      let loadedCount = 0;

      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.onload = () => {
            loadedCount++;
            if (loadedCount === images.length) handleImagesLoaded();
          };
        }
      });

      // If all images in the container are already loaded
      if (loadedCount === images.length) {
        handleImagesLoaded();
      }
    });

    // Adjust dimensions on window resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const graphtolatexButton = {
    selectedIcon: graphtolatexIcon,
    text: "Graph To<br>LaTeX",
    link: "https://jaredtweed.github.io/graphtolatex/",
    shadow: "var(--neumorphic-shadow)",
    color: "transparent",
    textColor: "var(--text-color)"
  };

  const sharedLensButton = {
    selectedIcon: sharedLensIcon,
    text: "Shared<br>Lens",
    link: "https://sharedlens.ca/",
    shadow: "var(--neumorphic-shadow)",
    color: "transparent",
    textColor: "var(--text-color)"
  };

  return (
    <div
      id="top"
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

          <HeroSection style={{ height: "70vh" }} />


          <div id="experience" className="section">
            <div className="grainy-section" />
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
                  <li><strong>Soft Skills:</strong> Engaged in face-to-face product improvement discussions with clients and worked as the sole developer for the business.</li>
                  <li><strong>Data Processing:</strong> Parsed JSON, XML, and CSV data using Python and utilized multithreading to optimize data curation speeds.</li>
                  <li><strong>Front End:</strong> Built custom widgets for ThingsBoard. Implemented features using HTML, CSS, and JavaScript. Optimized the ECharts charting library through multithreading and provided UX design recommendations.</li>
                  <li><strong>Back End:</strong> Developed backend solutions using Node-RED, researched optimal APIs through documentation reviews, implemented email subscriptions using SendGrid and AWS Lambda/EC2, integrated MongoDB with Node.js, and worked with MQTT protocols.</li>
                </ul>
              </div>

              <div className="MultiTimeSeriesEditor-container">
                <MultiTimeSeriesEditor />
              </div>
            </div>
          </div>





          <div id="projects" className="section">
            {/* <div className="grainy-section" /> */}

            <h2>Projects</h2>
            <h3>Websites</h3>
            <div style={{ margin: "0 40px", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <AnimatedButton settings={handsButton} />
              <AnimatedButton settings={bookingsButton} />
              <AnimatedButton settings={ttqbcButton} />
              <AnimatedButton settings={troublemakerButton} />
              <AnimatedButton settings={graphtolatexButton} />
              <AnimatedButton settings={sharedLensButton} />
            </div>
            {/* <h3>Computer Vision</h3> */}
            <h3>Other Projects</h3>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
              <div className="project neumorphic">
                <div className="job-text project-text">
                  <div className="header">
                    <div className="title-and-date">
                      <h3 className="title">Panorama Maker</h3>
                      <p className="date"><strong>Mar 2023</strong></p>
                    </div>
                    <div className="project-links">
                      <p className="info">MATLAB, Homographies, Harris Corner Detection, RANSAC</p>
                      <p className="info"><a href="https://github.com/JaredTweed/PanoramaMaker">More Info <img src={linkIcon} alt="Link Icon" className="linkIcon" /></a></p>
                    </div>
                  </div>
                  <ul>
                    <li>Creates a panorama from given input images.</li>
                  </ul>
                </div>
                <div className="project-images"><img src={panoramaImg1} height="100%" alt="" /><img src={panoramaImg2} height="100%" alt="" /></div>
              </div>

              <div className="project neumorphic">
                <div className="job-text project-text">
                  <div className="header">
                    <div className="title-and-date">
                      <h3 className="title">Java with Maven Game</h3>
                      <p className="date"><strong>Feb - Apr 2022</strong></p>
                    </div>
                    <div className="project-links">
                      <p className="info"><a href="https://github.com/JaredTweed/MouseMirageGame">More Info <img src={linkIcon} alt="Link Icon" className="linkIcon" /></a></p>
                    </div>
                  </div>
                  <ul>
                    <li>Led Mouse Mirage's Java development using Apache Maven and the Swing Framework.</li>
                    <li>Designed mechanics, including level progression, sound management, and UI navigation.</li>
                  </ul>
                </div>
                <div className="project-images"><img src={mouseImg2} height="100%" alt="" /><img src={mouseImg1} height="100%" alt="" /></div>
              </div>
            </div>
          </div>

          <div id="skills" className="section" >
            <div className="grainy-section" />
            <h2>Skills</h2>
            <div className="paper reference-measurement">
              <h3>Technical Skills</h3>
              <div className="skill-block">
                <p className="skill-p"><strong>Languages:</strong> Java, MATLAB, Python, C/C++, SQL (Postgres), HTML/CSS, Typescript, JavaScript, R, LaTeX</p>
                <p className="skill-p"><strong>Frameworks:</strong> Angular, React, Node.js (Express.js), Java Swing, Flask</p>
                <p className="skill-p"><strong>Developer Tools:</strong> Git, Google Cloud Platform, AWS Lambda & EC2, Visual Studio, Unity3D, Apache Maven</p>
                <p className="skill-p"><strong>Libraries:</strong> NumPy, OpenCV, Detectron2, PyTorch, Regex, Tkinter, Websocket.io, MongoDB, Postman</p>
              </div>
            </div>
            <div className="paper">
              <h3>Transferable Soft Skills</h3>
              <div className="skill-block">
                <p className="skill-p">Displayed a strong work ethic on Yukon diamond drilling rigs (up to 95 hours per week).</p>
                <p className="skill-p">Devoted years of volunteering and working with elementary school children.</p>
                <p className="skill-p">Excelled in culturally diverse workplaces.</p>
                <div className="project-images">
                  <img className="coaching-soft-skil-image" src={softSkillCoach} height="100%" alt="" />
                  <img src={softSkillYukon} height="100%" alt="" />
                </div>
              </div>
            </div>
          </div>

        </div >
      </main >

      <div id="contact" className="section" style={{ padding: "0px" }}>

        <footer style={{ padding: "20px 0", backgroundColor: "rgb(0, 0, 0)", color: "white", textAlign: "center", fontSize: "14px" }}>
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
