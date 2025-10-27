import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_SETTINGS = {
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

const buildFinalSettings = (settings = {}) => {
  const merged = { ...DEFAULT_SETTINGS, ...settings };
  const hasMdiIcon = merged.selectedIcon?.startsWith("mdi:");
  const spaceBetween = hasMdiIcon
    ? 0
    : merged.spaceBetween ?? (merged.horizontalAnim ? 5 : 0);
  const iconHoverColor = merged.iconHoverColor || merged.iconColor;
  const hoverColor = merged.hoverColor || merged.color;
  const hoverBorder = merged.hoverBorder || merged.border;
  const hoverShadow = merged.hoverShadow || merged.shadow;

  return {
    ...merged,
    spaceBetween,
    textActiveColor: merged.textActiveColor || merged.textColor,
    iconHoverColor,
    iconActiveColor: merged.iconActiveColor || iconHoverColor,
    hoverColor,
    activeColor: merged.activeColor || hoverColor,
    hoverBorder,
    activeBorder: merged.activeBorder || hoverBorder,
    hoverShadow,
    activeShadow: merged.activeShadow || hoverShadow,
  };
};

const getAccessibleLabel = (text) => {
  if (!text) return undefined;
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?[^>]*>/g, "")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .trim();
};

const AnimatedButton = ({ settings = {}, onAction }) => {
  const containerRef = useRef(null);
  const lastInputMethodRef = useRef("mouse");
  const [uniqueId] = useState(uuidv4());
  const [hoverState, setHoverState] = useState(false);
  const [activeState, setActiveState] = useState(false);

  const fs = useMemo(() => buildFinalSettings(settings), [settings]);
  const ariaLabel = useMemo(() => getAccessibleLabel(fs.text), [fs.text]);

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

    function showText() {
      textOverlay.style.opacity = "1";
      if (fs.horizontalAnim) {
        icon.style.transform = `translate(-${preCalculatedNum1}px, -50%)`;
        textOverlay.style.transform = `translate(${preCalculatedNum2}px, -50%)`;
      } else {
        icon.style.transform = `translate(-50%, -${preCalculatedNum3}px)`;
        textOverlay.style.transform = `translate(-50%, ${preCalculatedNum4}px)`;
      }
    }

    const handleMouseOver = () => {
      // console.log("mouseoverrrrr");
      mouseover = true;
      setHoverState(true);
      showText();

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


    const handleMouseMove = () => {
      if (lastInputMethodRef.current !== "mouse") {
        lastInputMethodRef.current = "mouse"; // Update the ref immediately
        handleMouseOut();
      }
    };

    const handleTouchStart = () => {
      if (lastInputMethodRef.current !== "touch") {
        lastInputMethodRef.current = "touch"; // Update the ref immediately
        handleMouseOver();
      }
    };

    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);

    handleMouseOut()
    cacheDimensions();


    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [fs, onAction, uniqueId]);

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

  return (
    <a
      href={fs.link}
      target="_self"
      id={`container_${uniqueId}`}
      ref={containerRef}
      style={containerStyle}
      aria-label={ariaLabel}
    ></a>
  );
};

export default AnimatedButton;
