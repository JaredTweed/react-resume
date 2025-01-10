import React, { useState, useEffect, useRef } from "react";
import AnimatedButton from "./components/AnimatedButton";
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





  const dataKeys = [
    {
      dataKey: {
        label: 'Temperature',
        // color: 'red',
        units: '°C',
        decimals: 1,
        settings: {
          isBarGraph: false,
          // showMin: true,
          // showMax: true,
          markAreas: [
            {
              markAreaMax: 23,  // End of the mark area
              markAreaColor: 'g' // 'g' for green (as per your logic)
            },
            {
              markAreaMin: 23.5,
              // markAreaMax: 24,
              markAreaColor: 'r' // 'r' for red
            }
          ]
          // ...
        }
      }
    },
    {
      dataKey: {
        label: 'Humidity',
        color: 'blue',
        units: '%',
        decimals: 0,
        settings: {
          // isBarGraph: true,
          showMin: false,
          yAxisMin: 42,
          // showMax: true,
          // ...
        }
      }
    }
  ];

  // "data" is an array of arrays:
  // data[0] corresponds to dataKeys[0], data[1] to dataKeys[1], etc.
  // Each sub-array is [[timestamp, value], [timestamp, value], ...].
  const [data, setData] = useState([
    [
      [Date.now() - 400000, 22.3],
      [Date.now() - 350000, 22.7],
      [Date.now() - 300000, 22.5],
      [Date.now() - 250000, 22.6],
      [Date.now() - 200000, 23.1],
      [Date.now() - 150000, 23.0],
      [Date.now() - 100000, 22.1],
      [Date.now() - 50000, 23.5],
      [Date.now(), 24.0],
    ],
    [
      [Date.now() - 400000, 39],
      [Date.now() - 350000, 41],
      [Date.now() - 300000, 40],
      [Date.now() - 250000, 43],
      [Date.now() - 200000, 45],
      [Date.now() - 150000, 44],
      [Date.now() - 100000, 42],
      [Date.now() - 50000, 43.5],
      [Date.now(), 43],
    ],
  ]);

  // Settings (similar to your original ThingsBoard widget settings)
  const settings = {
    // showMouseHeight: false,
    // showMin: false,
    // showMax: false,
    // showAvg: false,
    // showSum: false,
    syncTooltips: true,
    lineColor: '#fff'
  };

  // Time range
  const minTime = Date.now() - 400000;  // 400 sec ago
  const maxTime = Date.now();         // now

  // Live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      // Generate new data points for each series
      const newData = data.map((series) => {
        const newPoint = [now, series[series.length - 1][1] + Math.random() - 0.5]; // Random variation
        return [...series, newPoint];
      });

      setData(newData);
    }, 5 * 1000); // Update every 5 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [data]);


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
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        fontFamily: "Poppins, sans-serif",
        color: "#fff",
        textAlign: "center",
      }}
    >

      <header style={{ padding: "5px 20px", margin: "0", backgroundColor: "rgb(0, 0, 0)" }}>
        <h1 > <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Jared Tweed Portfolio</a></h1>
        <nav>
          <a href="#projects" style={{ margin: "0 10px", color: "white" }}>Projects</a>
          <a href="#experience" style={{ margin: "0 10px", color: "white" }}>Work Experience</a>
          <a href="#contact" style={{ margin: "0 10px", color: "white" }}>Contact</a>
        </nav>
      </header>

      <main>

        <div style={{
          // height: "100vh",
          padding: "10px",
          fontFamily: "Poppins, sans-serif", margin: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", position: "relative"
        }}>
          {/* Video Container */}
          <div style={{ position: "relative", height: "auto" }}>
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              style={{
                width: "100%",
                maxWidth: "770px",
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
                <AnimatedButton settings={resumeButton} />
              </div>
            )}

          </div>

          <h1>Projects</h1>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <AnimatedButton settings={handsButton} />
            <AnimatedButton settings={bookingsButton} />
            <AnimatedButton settings={ttqbcButton} />
            <AnimatedButton settings={troublemakerButton} />
          </div>

          <h1>Work Experience</h1>
          <div style={{
            height: "400px", width: "100%", display: "flex", // Enables flexbox
            justifyContent: "center", // Centers horizontally
            alignItems: "center", // Centers vertically 
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

        </div >
      </main >

      <footer style={{ padding: "10px", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
        <p>&copy; 2025 Jared Tweed. All Rights Reserved.</p>
        <a href="mailto:jaredtwe@gmail.com" style={{ color: "#007070", textDecoration: "none" }}>
          Contact Me
        </a>
      </footer>

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
