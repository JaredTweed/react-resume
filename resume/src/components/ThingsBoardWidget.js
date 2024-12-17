import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ThingsBoardWidget = ({ settings, onAction }) => {
  const containerRef = useRef(null);
  const [uniqueId] = useState(uuidv4());
  const [hoverState, setHoverState] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const {
      horizontalAnim = false,
      fontSize = 20,
      iconSize = 100,
      buttonWidth,
      buttonHeight,
      originalColor,
      hoverColor,
      activeColor,
      selectedIcon,
      text,
      spaceBetween = 0,
      iconColor = "white",
      iconHoverColor = "white",
      iconActiveColor = "white",
    } = settings;

    let preCalculatedNum1, preCalculatedNum2, preCalculatedNum3, preCalculatedNum4, preCalculatedNum5;
    console.log(settings.buttonHeight, settings.buttonWidth);

    const iconHTML = selectedIcon?.startsWith("mdi:")
      ? `<i class="mdi mdi-${selectedIcon.replace("mdi:", "")}" 
           style="
             font-size: ${Math.min(settings.buttonHeight, settings.buttonWidth) * (iconSize / 100)}px; 
             height: ${settings.buttonHeight < settings.buttonWidth ? `${iconSize * 0.7}%` : `${settings.buttonWidth * (iconSize / 100) * 0.7}px`};
             width: ${(Math.min(settings.buttonHeight, settings.buttonWidth) * (iconSize / 100)) * 0.84}px; 
             color: ${iconColor};
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
      const iconWidth = (Math.min(settings.buttonHeight, settings.buttonWidth) * (iconSize / 100)) * 0.84;
      // const iconHeight = icon.offsetHeight;
      const iconHeight = settings.buttonHeight < settings.buttonWidth ? iconSize * 0.7 * 0.01 * settings.buttonHeight : settings.buttonWidth * (iconSize / 100) * 0.7;
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

    setInterval(cacheDimensions, 1000);

    const handleMouseOver = () => {
      mouseover = true;
      setHoverState(true);
      textOverlay.style.opacity = "1";

      cacheDimensions();
      if (settings.horizontal) {
        icon.style.transform = `translate(-${preCalculatedNum1}px, -50%)`;
        textOverlay.style.transform = `translate(${preCalculatedNum2}px, -50%)`;
      } else {
        icon.style.transform = `translate(-50%, -${preCalculatedNum3}px)`;
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum4}px)`;
      }

    };

    const handleMouseOut = () => {
      mouseover = false;
      setHoverState(false);
      textOverlay.style.opacity = "0";
      icon.style.transform = "translate(-50%, -50%)";
      if (settings.horizontal) {
        textOverlay.style.transform = 'translate(-50%, -50%)'; // Reset text position
      } else {
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum5}px)`;
      }
    };

    const handleClick = (event) => {
      if (onAction) {
        onAction(event);
      }
    };

    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    container.addEventListener("click", handleClick);

    const dimensionInterval = setInterval(cacheDimensions, 100);

    const updateIconSize = () => {
      if (icon) {
        const newFontSize = `${Math.min(settings.buttonHeight, settings.buttonWidth) * (iconSize / 100)}px`;
        icon.style.fontSize = newFontSize;
        icon.style.color = iconColor;
      }
    };

    updateIconSize()

    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      container.removeEventListener("click", handleClick);
      clearInterval(dimensionInterval);
    };
  }, [settings, onAction, uniqueId]);

  const containerStyle = {
    position: "relative",
    width: `${settings.buttonWidth}px`,
    height: `${settings.buttonHeight}px`,
    border: "1px solid black",
    borderRadius: "10px",
    backgroundColor: hoverState ? settings.hoverColor : settings.originalColor,
    cursor: "pointer",
    overflow: "hidden",
  };

  return <div id={`container_${uniqueId}`} ref={containerRef} style={containerStyle}></div>;
};

export default ThingsBoardWidget;
