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
