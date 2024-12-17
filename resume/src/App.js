import React from "react";
import ThingsBoardWidget from "./components/ThingsBoardWidget";
import '@mdi/font/css/materialdesignicons.min.css'; // Import Material Design Icons CSS

const App = () => {
  const widgetSettings = {
    horizontalAnim: false,
    fontSize: 20,
    iconSize: 100,
    buttonWidth: 400,
    buttonHeight: 300,
    originalColor: "#00ffff",
    hoverColor: "#cccccc",
    activeColor: "#aaaaaa",
    selectedIcon: "mdi:home", // Use Material Design Icon (mdi)
    text: "Hello, World!",
    spaceBetween: 10,
  };

  const handleAction = (event) => {
    console.log("Widget clicked!", event);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <ThingsBoardWidget settings={widgetSettings} onAction={handleAction} />
    </div>
  );
};

export default App;
