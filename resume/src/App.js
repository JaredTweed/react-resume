import React from "react";
import ThingsBoardWidget from "./components/ThingsBoardWidget";
import '@mdi/font/css/materialdesignicons.min.css'; // Import Material Design Icons CSS
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/700.css"; // Bold weight
import handsIcon from "./assets/hands.png"

const App = () => {
  const widgetSettings = {
    selectedIcon: handsIcon,
    text: "Hands<br>Detector",
    link: "https://jaredtweed.github.io/hands/",
  };

  const handleAction = (event) => {
    console.log("Widget clicked!");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <ThingsBoardWidget settings={widgetSettings} onAction={handleAction} />
      <ThingsBoardWidget />
    </div>
  );
};

export default App;
