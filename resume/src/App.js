import React from "react";
import ThingsBoardWidget from "./components/ThingsBoardWidget";

const App = () => {
  const widgetSettings = {
    horizontalAnim: false,
    fontSize: 20,
    iconSize: 100,
    originalColor: "#ffffff",
    hoverColor: "#cccccc",
    activeColor: "#aaaaaa",
    selectedIcon: "mdi:home",
    text: "Hello, World!",
    spaceBetween: 10,
  };

  const handleAction = (event) => {
    console.log("Widget clicked!", event);
  };

  return (
    <div style={{ width: "500px", height: "500px" }}>
      <ThingsBoardWidget settings={widgetSettings} onAction={handleAction} />
    </div>
  );
};

export default App;
