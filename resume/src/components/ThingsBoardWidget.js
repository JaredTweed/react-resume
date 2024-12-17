import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ThingsBoardWidget = ({ settings, onAction }) => {
  const containerRef = useRef(null);
  const [uniqueId] = useState(uuidv4());
  const [hoverState, setHoverState] = useState(false);
  const [activeState, setActiveState] = useState(false);

  // Default settings
  const defaultSettings = {
    horizontalAnim: false,
    fontSize: "20px",
    fontWeight: 400,
    border: "none",
    iconSize: 100,
    buttonWidth: 300,
    buttonHeight: 200,
    color: "black",
    selectedIcon: "mdi:home",
    text: "Use &lt;br&gt; for<br>a newline",
    textColor: "white",
    spaceBetween: 0,
    iconColor: "white",
    borderRadius: "20px",
  };

  // Merge user settings with defaults
  const fs = { ...defaultSettings, ...settings };

  fs.textActiveColor = fs.textActiveColor || fs.textColor;
  fs.iconHoverColor = fs.iconHoverColor || fs.iconColor;
  fs.iconActiveColor = fs.iconActiveColor || fs.iconHoverColor;
  fs.hoverColor = fs.hoverColor || fs.color;
  fs.activeColor = fs.activeColor || fs.hoverColor;
  fs.hoverBorder = fs.hoverBorder || fs.border;
  fs.activeBorder = fs.activeBorder || fs.hoverBorder;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let preCalculatedNum1, preCalculatedNum2, preCalculatedNum3, preCalculatedNum4, preCalculatedNum5;
    // console.log(buttonHeight, buttonWidth);

    const iconHTML = fs.selectedIcon?.startsWith("mdi:")
      ? `<i class="mdi mdi-${fs.selectedIcon.replace("mdi:", "")}" 
           style="
             font-size: ${Math.min(fs.buttonHeight, fs.buttonWidth) * (fs.iconSize / 100)}px; 
             height: ${fs.buttonHeight < fs.buttonWidth ? `${fs.iconSize * 0.7}%` : `${fs.buttonWidth * (fs.iconSize / 100) * 0.7}px`};
             width: ${(Math.min(fs.buttonHeight, fs.buttonWidth) * (fs.iconSize / 100)) * 0.84}px; 
             position: absolute; 
             left: 50%; 
             top: 50%; 
             transform: translate(-50%, -50%); 
             display: flex; 
             justify-content: center; 
             align-items: center; 
             transition: all 0.3s ease-in-out;">
         </i>`
      : `<tb-icon style="font-size: ${fs.iconSize}px;">${fs.selectedIcon}</tb-icon>`;

    container.innerHTML = `
      ${iconHTML}
      <div id="text-overlay" 
           style="
              position: absolute;
              font-size: ${fs.fontSize};
              font-weight: ${fs.fontWeight};
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

    const icon = container.querySelector(".mdi, .icon");
    const textOverlay = container.querySelector("#text-overlay");
    let mouseover = false;

    const cacheDimensions = () => {
      // const iconWidth = (Math.min(buttonHeight, buttonWidth) * (iconSize / 100)) * 0.84;
      // const iconHeight = Math.round(buttonHeight < buttonWidth ? iconSize * 0.7 * 0.01 * buttonHeight : buttonWidth * (iconSize / 100) * 0.7);
      const iconWidth = icon.offsetWidth;
      const iconHeight = icon.offsetHeight;
      const textWidth = textOverlay.offsetWidth;
      const textHeight = textOverlay.offsetHeight;

      console.log(iconWidth, textWidth, iconHeight, textHeight);

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

      cacheDimensions();
      if (fs.horizontalAnim) {
        icon.style.transform = `translate(-${preCalculatedNum1}px, -50%)`;
        textOverlay.style.transform = `translate(${preCalculatedNum2}px, -50%)`;
      } else {
        icon.style.transform = `translate(-50%, -${preCalculatedNum3}px)`;
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum4}px)`;
      }

      icon.style.color = fs.iconHoverColor;
      container.style.border = fs.hoverBorder;
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
    };

    const handleMouseDown = () => {
      setActiveState(true);
      icon.style.color = fs.iconActiveColor; // Apply active color to icon
      container.style.backgroundColor = fs.activeColor;
      textOverlay.style.color = fs.textActiveColor;
      container.style.border = fs.activeBorder;
    };

    const handleMouseUp = () => {
      setActiveState(false);
      icon.style.color = fs.iconHoverColor; // Reset to hover color
      container.style.backgroundColor = fs.hoverColor;
      textOverlay.style.color = fs.textColor;
      container.style.border = fs.hoverBorder;
    };

    const handleClick = (event) => {
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
    width: `${fs.buttonWidth}px`,
    height: `${fs.buttonHeight}px`,
    border: `${fs.border}`,
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
