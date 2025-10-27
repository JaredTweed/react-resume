import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Grainy Effect Overlay */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999, // Ensure it stays above everything
        pointerEvents: "none", // Allow interactions with underlying elements
        opacity: 0.2, // Adjust intensity
        display: "none"
      }}
    >
      <svg style={{ width: "100%", height: "100%" }}>
        <filter id="grainy" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.5" // Adjust frequency for desired grain size
            numOctaves="18"
          // seed="4"
          // result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0" // Make it grayscale
          />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
        <rect
          width="100%"
          height="100%"
          style={{ filter: "url(#grainy)" }}
          fill="white"
        />
      </svg>
    </div>

    {/* Main App */}
    <App />
  </React.StrictMode>
);
