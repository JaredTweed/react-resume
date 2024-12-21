import React, { useState, useRef } from "react";
import ThingsBoardWidget from "./components/ThingsBoardWidget";
import '@mdi/font/css/materialdesignicons.min.css'; // Import Material Design Icons CSS
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/700.css"; // Bold weight
import handsIcon from "./assets/hands.png";
import troublemakerIcon from "./assets/troublemaker.jpg";
import tealBlackVideo from "./assets/teal-black.mp4"; // Import the video file

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

  const handleAction = (event) => {
    console.log("Widget clicked!");
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
    <div style={{ fontFamily: "Poppins, sans-serif", marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", position: "relative" }}>
      {/* Video Container */}
      <div style={{ position: "relative", maxWidth: "90%", height: "auto" }}>
        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "20px",
            display: "block",
          }}
          src={tealBlackVideo}
        />

        {/* Text Element */}
        {showText && (
          <div
            style={{
              position: "absolute",
              top: showResume ? "calc(50% - 30px)" : "50%", // Adjust position based on resume visibility
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              fontWeight: 700,
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              width: "100%",
              textAlign: "center",
              opacity: 0,
              animation: "fadeIn 2s forwards",
              transition: "top 1s ease", // Smooth transition for the top position
            }}
          >
            Jared Tweed<br />Full-Stack Developer

          </div>
        )}

        {/* Resume Button */}
        {showResume && (
          <div
            style={{
              position: "absolute",
              top: "calc(50% + 40px)",
              left: "50%",
              transform: "translate(-50%, -50%)",


              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "top 1s ease",
              opacity: 0,
              animation: "fadeIn 2s forwards",
            }}
          >
            <ThingsBoardWidget settings={resumeButton} />
          </div>
        )}

      </div>

      <h1>Projects</h1>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
        <ThingsBoardWidget settings={handsButton} />
        <ThingsBoardWidget settings={troublemakerButton} />
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
    </div>
  );
};

export default App;
