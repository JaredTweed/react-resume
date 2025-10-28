import React, { useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  useEffect(() => {
    // Event delegation for hover effects
    const handleMouseEnter = (e) => {
      if (e.target.classList.contains("nav-button")) {
        e.target.style.transform = "scale(1.2)";
      }
    };

    const handleMouseLeave = (e) => {
      if (e.target.classList.contains("nav-button")) {
        e.target.style.transform = "scale(1)";
      }
    };

    // Attach event listeners to the parent
    const navContainer = document.querySelector("nav");
    navContainer.addEventListener("mouseenter", handleMouseEnter, true);
    navContainer.addEventListener("mouseleave", handleMouseLeave, true);

    // Cleanup
    return () => {
      navContainer.removeEventListener("mouseenter", handleMouseEnter, true);
      navContainer.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, []);


  return (

    <header>
      {/* Grainy Effect Overlay */}
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999, // Ensure it stays above everything
          pointerEvents: "none", // Allow interactions with underlying elements
          opacity: 0.22, // Adjust intensity
        }}
      >
        <svg style={{ width: "100%", height: "100%" }}>
          <filter id="grainy" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.9" // Adjust frequency for desired grain size
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
      </div> */}


      {/* Gooey + Shadow Filter */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter
          id="gooey"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          {/* 1) Blur the graphic */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />

          {/* 2) Convert the blurred graphic into a thicker goo shape */}
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 40 -20
            "
            result="gooey"
          />

          {/* 3) Outer Shadow (drop shadow) */}
          <feDropShadow
            dx="5"
            dy="5"
            stdDeviation="4"
            floodColor="black"
            floodOpacity="0.6"
            in="gooey"
            result="darkShadow"
          />

          {/* 3) Outer Shadow (drop shadow) */}
          <feDropShadow
            dx="-5"
            dy="-5"
            stdDeviation="4"
            floodColor="white"
            floodOpacity="0.2"
            in="gooey"
            result="lightShadow"
          />

          <feBlend in="darkShadow" in2="lightShadow" mode="normal" result="shadows" />

          {/* 6) Blend the SourceGraphic with the shadow on top */}
          <feBlend in="SourceGraphic" in2="shadows" mode="normal" />
        </filter>
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <a href="#top" style={{ textDecoration: "none", fontWeight: "bold", fontSize: "20px", lineHeight: "20px" }}>
          Jared<br />Tweed
        </a>

        {/* Navbar Links */}
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "11px",
            filter: "url(#gooey)", // apply the gooey filter + shadows
          }}
        >
          <a href="#experience" className="nav-button">Work Experience</a>
          <a href="#projects" className="nav-button">Projects</a>
          <a href="#skills" className="nav-button">Skills</a>
          <a href="#contact" className="nav-button">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
