import React from "react";

const Navbar = () => {
  return (




    <header
      style={{
        padding: "20px",
        margin: "0",
        position: "sticky",
        top: "0",
        zIndex: "1000",
        backgroundColor: "white",
        boxShadow: "0px 5px 10px rgba(0,0,0,0.5)",
      }}
    >
      {/* Grainy Effect Overlay */}
      <div
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
      </div>


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
            result="outerShadow"
          />

          {/* 6) Blend the SourceGraphic with the shadow on top */}
          <feBlend in="SourceGraphic" in2="outerShadow" mode="normal" />
        </filter>
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ color: "black", fontWeight: "bold", fontSize: "25px", lineHeight: "25px" }}>Jared<br />Tweed</div>

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
          <a
            href="#projects"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              // Option A) slightly transparent:
              backgroundColor: "white",
              borderRadius: "50px",
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Projects
          </a>
          <a
            href="#experience"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "white",
              borderRadius: "50px",
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Work Experience
          </a>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "white",
              borderRadius: "50px",
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
