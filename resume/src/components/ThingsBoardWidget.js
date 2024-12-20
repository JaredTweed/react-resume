import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ThingsBoardWidget = ({ settings, onAction }) => {
  const containerRef = useRef(null);
  const [uniqueId] = useState(uuidv4());
  const [hoverState, setHoverState] = useState(false);
  const [activeState, setActiveState] = useState(false);

  // Default settings
  const defaultSettings = {
    horizontalAnim: true,
    fontSize: "20px",
    fontWeight: 700,
    border: "none",
    shadow: "none",
    iconSize: 100,
    iconBorder: "none",
    iconBorderRadius: "10px",
    width: 250,
    height: 70,
    color: "black",
    selectedIcon: "mdi:home",
    text: "Use &lt;br&gt; for<br>a newline",
    textColor: "white",
    iconColor: "white",
    borderRadius: "20px",
    link: null,
  };

  // Merge user settings with defaults
  const fs = { ...defaultSettings, ...settings };

  // Defaults dependent on final settings
  fs.spaceBetween = fs.selectedIcon?.startsWith("mdi:") ? 0 : fs.spaceBetween || fs.horizontalAnim ? 5 : 0;
  fs.textActiveColor = fs.textActiveColor || fs.textColor;
  fs.iconHoverColor = fs.iconHoverColor || fs.iconColor;
  fs.iconActiveColor = fs.iconActiveColor || fs.iconHoverColor;
  fs.hoverColor = fs.hoverColor || fs.color;
  fs.activeColor = fs.activeColor || fs.hoverColor;
  fs.hoverBorder = fs.hoverBorder || fs.border;
  fs.activeBorder = fs.activeBorder || fs.hoverBorder;
  fs.hoverShadow = fs.hoverShadow || fs.shadow;
  fs.activeShadow = fs.activeShadow || fs.hoverShadow;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let preCalculatedNum1, preCalculatedNum2, preCalculatedNum3, preCalculatedNum4, preCalculatedNum5;

    const iconHTML = fs.selectedIcon?.startsWith("mdi:")
      ? `<i id="icon" class="mdi mdi-${fs.selectedIcon.replace("mdi:", "")}" 
           style="
              font-size: ${Math.min(fs.height, fs.width) * (fs.iconSize / 100)}px; 
              height: ${fs.height < fs.width ? `${fs.iconSize * 0.7}%` : `${fs.width * (fs.iconSize / 100) * 0.7}px`};
              width: ${(Math.min(fs.height, fs.width) * (fs.iconSize / 100)) * 0.84}px; 
              position: absolute; 
              left: 50%; 
              top: 50%; 
              transform: translate(-50%, -50%); 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              transition: all 0.3s ease-in-out;">
         </i>`
      : `<img id="icon" src="${fs.selectedIcon}" 
            alt="icon"
            style="
              width: ${fs.width < fs.height ? (fs.iconSize * 0.7) + '%' : 'auto'};
              height: ${fs.width > fs.height ? (fs.iconSize * 0.7) + '%' : 'auto'};
              position: absolute;
              border: ${fs.iconBorder};
              border-radius: ${fs.iconBorderRadius};
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              transition: all 0.3s ease-in-out;">
          </img>`;

    container.innerHTML = `
      ${iconHTML}
      <div id="text-overlay" 
           style="
              position: absolute;
              font-size: ${fs.fontSize};
              font-weight: ${fs.fontWeight};
              font-family: 'Poppins', sans-serif;
              line-height: 1.2;
              color: ${fs.textColor};
              left: 50%;
              top: 50%;
              white-space: nowrap;
              opacity: 0;
              text-align: ${fs.horizontalAnim ? "left" : "center"};
              transform: translate(-50%, -50%);
              transition: all 0.25s ease-in-out;
          ">
          ${fs.text}
      </div>
    `;

    const icon = container.querySelector("#icon");
    const textOverlay = container.querySelector("#text-overlay");
    let mouseover = false;

    const cacheDimensions = () => {
      // const iconWidth = (Math.min(buttonHeight, buttonWidth) * (iconSize / 100)) * 0.84;
      // const iconHeight = Math.round(buttonHeight < buttonWidth ? iconSize * 0.7 * 0.01 * buttonHeight : buttonWidth * (iconSize / 100) * 0.7);
      if (
        !icon ||
        !textOverlay ||
        icon.offsetWidth === 0 ||
        icon.offsetHeight === 0 ||
        textOverlay.offsetWidth === 0 ||
        textOverlay.offsetHeight === 0
      ) {
        setTimeout(() => cacheDimensions(), 100);
        return;
      }

      const iconWidth = icon.offsetWidth;
      const iconHeight = icon.offsetHeight;
      const textWidth = textOverlay.offsetWidth;
      const textHeight = textOverlay.offsetHeight;

      // console.log(iconWidth, textWidth, iconHeight, textHeight);

      const totalWidth = iconWidth + textWidth + fs.spaceBetween;
      const totalHeight = iconHeight + textHeight + fs.spaceBetween;

      // Pre-calculate values for smooth positioning
      preCalculatedNum1 = totalWidth / 2;
      preCalculatedNum2 = totalWidth / 2 - textWidth + 3 + fs.spaceBetween;
      preCalculatedNum3 = totalHeight / 2;
      preCalculatedNum4 = totalHeight / 2 - textHeight + fs.spaceBetween;
      preCalculatedNum5 = totalHeight / 2 - textHeight * 1.5;

      // Apply transformations for non-horizontal and non-mouseover states
      if (!fs.horizontalAnim && !mouseover) {
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum5}px)`;
      }
    };

    // setInterval(cacheDimensions, 1000);

    const handleMouseOver = () => {
      mouseover = true;
      setHoverState(true);
      textOverlay.style.opacity = "1";


      if (fs.horizontalAnim) {
        icon.style.transform = `translate(-${preCalculatedNum1}px, -50%)`;
        textOverlay.style.transform = `translate(${preCalculatedNum2}px, -50%)`;
      } else {
        icon.style.transform = `translate(-50%, -${preCalculatedNum3}px)`;
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum4}px)`;
      }

      icon.style.color = fs.iconHoverColor;
      container.style.border = fs.hoverBorder;
      container.style.boxShadow = fs.hoverShadow;
    };

    const handleMouseOut = () => {
      mouseover = false;
      setHoverState(false);
      textOverlay.style.opacity = "0";
      icon.style.transform = "translate(-50%, -50%)";
      if (fs.horizontalAnim) {
        textOverlay.style.transform = 'translate(-50%, -50%)'; // Reset text position
      } else {
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum5}px)`;
      }

      icon.style.color = fs.iconColor;
      container.style.border = fs.border;
      container.style.boxShadow = fs.shadow;
    };

    const handleMouseDown = () => {
      setActiveState(true);
      icon.style.color = fs.iconActiveColor; // Apply active color to icon
      container.style.backgroundColor = fs.activeColor;
      textOverlay.style.color = fs.textActiveColor;
      container.style.border = fs.activeBorder;
      container.style.boxShadow = fs.activeShadow;
    };

    const handleMouseUp = () => {
      setActiveState(false);
      icon.style.color = fs.iconHoverColor; // Reset to hover color
      container.style.backgroundColor = fs.hoverColor;
      textOverlay.style.color = fs.textColor;
      container.style.border = fs.hoverBorder;
      container.style.boxShadow = fs.hoverShadow;
    };

    const handleClick = (event) => {
      if (fs.link) {
        window.open(fs.link, "_blank"); // Open link in a new tab
      }
      if (onAction) {
        onAction(event);
      }
    };

    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("click", handleClick);

    handleMouseOut()
    cacheDimensions();

    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("click", handleClick);
    };
  }, [settings, onAction, uniqueId]);

  const containerStyle = {
    position: "relative",
    width: `${fs.width}px`,
    height: `${fs.height}px`,
    border: `${fs.border}`,
    shadow: `${fs.shadow}`,
    borderRadius: `${fs.borderRadius}`,
    backgroundColor: activeState
      ? fs.activeColor
      : hoverState
        ? fs.hoverColor
        : fs.color,
    cursor: "pointer",
    overflow: "hidden",
    transition: "background-color 0.1s ease-in-out",
  };

  return <div id={`container_${uniqueId}`} ref={containerRef} style={containerStyle}></div>;
};

export default ThingsBoardWidget;
