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

    const iconHTML = selectedIcon?.startsWith("mdi:")
      ? `<i class="mdi mdi-${selectedIcon.replace("mdi:", "")}" 
           style="
             font-size: ${Math.min(container.offsetHeight, container.offsetWidth) * (iconSize / 100)}px; 
             height: ${container.offsetHeight < container.offsetWidth
        ? `${iconSize * 0.7}%`
        : `${container.offsetWidth * (iconSize / 100) * 0.7}px`};
             width: ${(Math.min(container.offsetHeight, container.offsetWidth) * (iconSize / 100)) * 0.84}px; 
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
      const iconWidth = icon.offsetWidth;
      const textWidth = textOverlay.offsetWidth;
      const iconHeight = icon.offsetHeight;
      const textHeight = textOverlay.offsetHeight;

      const totalWidth = iconWidth + textWidth + spaceBetween;
      const totalHeight = iconHeight + textHeight + spaceBetween;

      textOverlay.style.transform = `translate(-50%, ${!horizontalAnim && !mouseover ? `${-totalHeight / 2 + textHeight * 1.5}px` : "-50%"
        })`;

      if (horizontalAnim && mouseover) {
        icon.style.transform = `translate(-${totalWidth / 2}px, -50%)`;
        textOverlay.style.transform = `translate(${totalWidth / 2 - textWidth}px, -50%)`;
      }
    };

    const handleMouseOver = () => {
      mouseover = true;
      setHoverState(true);
      textOverlay.style.opacity = "1";
      cacheDimensions();
    };

    const handleMouseOut = () => {
      mouseover = false;
      setHoverState(false);
      textOverlay.style.opacity = "0";
      icon.style.transform = "translate(-50%, -50%)";
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

    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      container.removeEventListener("click", handleClick);
      clearInterval(dimensionInterval);
    };
  }, [settings, onAction, uniqueId]);

  const containerStyle = {
    position: "relative",
    width: settings.buttonWidth,
    height: settings.buttonHeight,
    border: "1px solid black",
    borderRadius: "10px",
    backgroundColor: hoverState ? settings.hoverColor : settings.originalColor,
    cursor: "pointer",
    overflow: "hidden",
  };

  return <div id={`container_${uniqueId}`} ref={containerRef} style={containerStyle}></div>;
};

export default ThingsBoardWidget;
