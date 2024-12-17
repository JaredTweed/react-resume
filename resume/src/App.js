import React from "react";
import ThingsBoardWidget from "./components/ThingsBoardWidget";
import '@mdi/font/css/materialdesignicons.min.css'; // Import Material Design Icons CSS

const App = () => {
  const widgetSettings = {
    horizontalAnim: false,
    // fontSize: 20,
    iconSize: 100,
    // buttonWidth: 400,
    // buttonHeight: 300,
    color: "black",
    border: "10px solid green",
    activeBorder: '10px solid blue',
    hoverBorder: '10px solid red',
    // hoverColor: "#cccccc",
    // activeColor: "#aaaaaa",
    // borderRadius: "5px",
    // selectedIcon: "mdi:home", // Use Material Design Icon (mdi)
    // text: "Hello, World!",
    textActiveColor: 'blue',
    spaceBetween: 0,
  };

  const handleAction = (event) => {
    console.log("Widget clicked!", event);
  };

  return (
    // <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap">

    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <ThingsBoardWidget style="border-radius: 20px;" settings={widgetSettings} onAction={handleAction} />
    </div>
  );
};

export default App;
