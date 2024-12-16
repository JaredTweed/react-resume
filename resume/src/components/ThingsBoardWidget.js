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
      ? `<i class="mdi mdi-${selectedIcon.replace(
        "mdi:",
        ""
      )}" style="font-size: ${iconSize}px;"></i>`
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

    const handleMouseOver = () => {
      setHoverState(true);
      textOverlay.style.opacity = "1";
      if (horizontalAnim) {
        icon.style.transform = `translate(-${icon.offsetWidth / 2}px, -50%)`;
        textOverlay.style.transform = `translate(${icon.offsetWidth / 2 - spaceBetween
          }px, -50%)`;
      } else {
        icon.style.transform = `translate(-50%, -${icon.offsetHeight / 2}px)`;
        textOverlay.style.transform = `translate(-50%, ${icon.offsetHeight / 2}px)`;
      }
    };

    const handleMouseOut = () => {
      setHoverState(false);
      textOverlay.style.opacity = "0";
      icon.style.transform = "translate(-50%, -50%)";
      textOverlay.style.transform = `translate(-50%, -50%)`;
    };

    const handleClick = (event) => {
      if (onAction) {
        onAction(event);
      }
    };

    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      container.removeEventListener("click", handleClick);
    };
  }, [settings, onAction, uniqueId]);

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    cursor: "pointer",
    backgroundColor: hoverState ? settings.hoverColor : settings.originalColor,
  };

  return <div id={`container_${uniqueId}`} ref={containerRef} style={containerStyle}></div>;
};

export default ThingsBoardWidget;
