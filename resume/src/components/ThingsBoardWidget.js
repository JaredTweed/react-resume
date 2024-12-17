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
    fontSize: 20,
    iconSize: 100,
    buttonWidth: 300,
    buttonHeight: 200,
    originalColor: "black",
    hoverColor: "#cccccc",
    activeColor: "#aaaaaa",
    selectedIcon: "mdi:star",
    text: "Button",
    textColor: "white",
    spaceBetween: 0,
    iconColor: "white",
    iconHoverColor: "blue",
    iconActiveColor: "red",
  };

  // Merge user settings with defaults
  const finalSettings = { ...defaultSettings, ...settings };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const {
      horizontalAnim,
      fontSize,
      iconSize,
      buttonWidth,
      buttonHeight,
      originalColor,
      hoverColor,
      activeColor,
      selectedIcon,
      text,
      textColor,
      spaceBetween,
      iconColor,
      iconHoverColor,
      iconActiveColor,
    } = finalSettings;

    let preCalculatedNum1, preCalculatedNum2, preCalculatedNum3, preCalculatedNum4, preCalculatedNum5;
    console.log(buttonHeight, buttonWidth);

    const iconHTML = selectedIcon?.startsWith("mdi:")
      ? `<i class="mdi mdi-${selectedIcon.replace("mdi:", "")}" 
           style="
             font-size: ${Math.min(buttonHeight, buttonWidth) * (iconSize / 100)}px; 
             height: ${buttonHeight < buttonWidth ? `${iconSize * 0.7}%` : `${buttonWidth * (iconSize / 100) * 0.7}px`};
             width: ${(Math.min(buttonHeight, buttonWidth) * (iconSize / 100)) * 0.84}px; 
             position: absolute; 
             left: 50%; 
             top: 50%; 
             transform: translate(-50%, -50%); 
             display: flex; 
             justify-content: center; 
             align-items: center; 
             transition: all 0.3s ease-in-out;">
         </i>`
      : `<tb-icon style="font-size: ${iconSize}px;">${selectedIcon}</tb-icon>`;

    container.innerHTML = `
      ${iconHTML}
      <div id="text-overlay" 
           style="
              position: absolute;
              font-size: ${fontSize}px;
              color: ${textColor};
              left: 50%;
              top: 50%;
              white-space: nowrap;
              opacity: 0;
              text-align: ${horizontalAnim ? "left" : "center"};
              transform: translate(-50%, -50%);
              transition: all 0.25s ease-in-out;
          ">
          ${text}
      </div>
    `;

    const icon = container.querySelector(".mdi, .icon");
    const textOverlay = container.querySelector("#text-overlay");
    let mouseover = false;

    const cacheDimensions = () => {
      const iconWidth = (Math.min(buttonHeight, buttonWidth) * (iconSize / 100)) * 0.84;
      // const iconHeight = icon.offsetHeight;
      const iconHeight = Math.round(buttonHeight < buttonWidth ? iconSize * 0.7 * 0.01 * buttonHeight : buttonWidth * (iconSize / 100) * 0.7);
      const textWidth = textOverlay.offsetWidth;
      const textHeight = textOverlay.offsetHeight;

      console.log(iconWidth, textWidth, iconHeight, textHeight);

      const totalWidth = iconWidth + textWidth + spaceBetween;
      const totalHeight = iconHeight + textHeight + spaceBetween;

      // Pre-calculate values for smooth positioning
      preCalculatedNum1 = totalWidth / 2;
      preCalculatedNum2 = totalWidth / 2 - textWidth + 3 + spaceBetween;
      preCalculatedNum3 = totalHeight / 2;
      preCalculatedNum4 = totalHeight / 2 - textHeight + spaceBetween;
      preCalculatedNum5 = totalHeight / 2 - textHeight * 1.5;

      // Apply transformations for non-horizontal and non-mouseover states
      if (!horizontalAnim && !mouseover) {
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum5}px)`;
      }
    };

    // setInterval(cacheDimensions, 1000);

    const handleMouseOver = () => {
      mouseover = true;
      setHoverState(true);
      textOverlay.style.opacity = "1";

      cacheDimensions();
      if (horizontalAnim) {
        icon.style.transform = `translate(-${preCalculatedNum1}px, -50%)`;
        textOverlay.style.transform = `translate(${preCalculatedNum2}px, -50%)`;
      } else {
        icon.style.transform = `translate(-50%, -${preCalculatedNum3}px)`;
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum4}px)`;
      }

      icon.style.color = iconHoverColor;
    };

    const handleMouseOut = () => {
      mouseover = false;
      setHoverState(false);
      textOverlay.style.opacity = "0";
      icon.style.transform = "translate(-50%, -50%)";
      if (horizontalAnim) {
        textOverlay.style.transform = 'translate(-50%, -50%)'; // Reset text position
      } else {
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum5}px)`;
      }

      icon.style.color = iconColor;
    };

    const handleMouseDown = () => {
      setActiveState(true);
      icon.style.color = iconActiveColor; // Apply active color to icon
      container.style.backgroundColor = activeColor;
    };

    const handleMouseUp = () => {
      setActiveState(false);
      icon.style.color = iconHoverColor; // Reset to hover color
      container.style.backgroundColor = hoverColor;
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

    const updateIconSize = () => {
      if (icon) {
        const newFontSize = `${Math.min(buttonHeight, buttonWidth) * (iconSize / 100)}px`;
        icon.style.fontSize = newFontSize;
        // icon.style.color = iconColor;
      }
    };

    updateIconSize()
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
    width: `${finalSettings.buttonWidth}px`,
    height: `${finalSettings.buttonHeight}px`,
    border: "1px solid black",
    borderRadius: "10px",
    backgroundColor: activeState
      ? finalSettings.activeColor
      : hoverState
        ? finalSettings.hoverColor
        : finalSettings.originalColor,
    cursor: "pointer",
    overflow: "hidden",
    transition: "background-color 0.1s ease-in-out",
  };

  return <div id={`container_${uniqueId}`} ref={containerRef} style={containerStyle}></div>;
};

export default ThingsBoardWidget;
