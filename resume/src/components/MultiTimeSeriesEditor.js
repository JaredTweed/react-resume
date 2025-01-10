import React, { useEffect, useState, useRef } from "react";
import MultiTimeSeries from "./MultiTimeSeries";

const MultiTimeSeriesEditor = ({ initialDataKeys, initialSettings }) => {
  const [data, setData] = useState([
    [
      [Date.now() - 400000, 22.3],
      [Date.now() - 350000, 22.7],
      [Date.now() - 300000, 22.5],
      [Date.now() - 250000, 22.6],
      [Date.now() - 200000, 23.1],
      [Date.now() - 150000, 23.0],
      [Date.now() - 100000, 22.1],
      [Date.now() - 50000, 23.5],
      [Date.now(), 24.0],
    ],
    [
      [Date.now() - 400000, 39],
      [Date.now() - 350000, 41],
      [Date.now() - 300000, 40],
      [Date.now() - 250000, 43],
      [Date.now() - 200000, 45],
      [Date.now() - 150000, 44],
      [Date.now() - 100000, 42],
      [Date.now() - 50000, 43.5],
      [Date.now(), 43],
    ],
  ]);

  const [dataKeys, setDataKeys] = useState([
    {
      dataKey: {
        label: "Temperature",
        units: "°C",
        decimals: 1,
        settings: {
          isBarGraph: false,
          markAreas: [
            { markAreaMax: 23, markAreaColor: "g" },
            { markAreaMin: 23, markAreaMax: 23.5, markAreaColor: "y" },
            { markAreaMin: 23.5, markAreaColor: "r" },
          ],
        },
      },
    },
    {
      dataKey: {
        label: "Humidity",
        color: "blue",
        units: "%",
        decimals: 0,
        settings: {
          showMin: false,
          yAxisMin: 42,
        },
      },
    },
  ]);

  const settings = {
    syncTooltips: true,
    lineColor: "#000000",
  };

  const dataRef = useRef(data);

  // Periodic data update for all keys
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      const newData = dataRef.current.map((series) => {
        const lastValue = series[series.length - 1][1];
        const newPoint = [now, lastValue + Math.random() - 0.5];
        return [...series, newPoint];
      });

      dataRef.current = newData;
      setData(newData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addDataKey = () => {
    const newIndex = dataKeys.length + 1;
    const newLabel = `DataKey ${newIndex}`;

    function getRandomTimeSeriesData() {
      const units = [
        { shorthand: "°C", label: "Temperature", initial: () => 15 + Math.random() * 20, decimals: 2 },
        { shorthand: "%", label: "Humidity", initial: () => 30 + Math.random() * 50, decimals: 0 },
        { shorthand: "kPa", label: "Pressure", initial: () => 95 + Math.random() * 10, decimals: 2 },
        { shorthand: "m/s", label: "Wind Speed", initial: () => 1 + Math.random() * 10, decimals: 1 },
        { shorthand: "dB", label: "Noise Level", initial: () => 30 + Math.random() * 40, decimals: 0 },
        { shorthand: "kWh", label: "Energy Consumption", initial: () => 50 + Math.random() * 100, decimals: 2 },
        { shorthand: "RPM", label: "Engine Speed", initial: () => 1000 + Math.random() * 2000, decimals: 0 },
        { shorthand: "mg/L", label: "Dissolved Oxygen", initial: () => 6 + Math.random() * 2, decimals: 2 },
        { shorthand: "μg/m³", label: "Air Quality (PM2.5)", initial: () => 10 + Math.random() * 40, decimals: 1 },
        { shorthand: "mm", label: "Rainfall", initial: () => Math.random() * 20, decimals: 1 },
        { shorthand: "ppm", label: "CO2 Concentration", initial: () => 380 + Math.random() * 50, decimals: 1 },
        { shorthand: "L/min", label: "Water Flow Rate", initial: () => 10 + Math.random() * 20, decimals: 1 },
        { shorthand: "°F", label: "Temperature (F)", initial: () => 60 + Math.random() * 30, decimals: 2 },
        { shorthand: "lux", label: "Illuminance", initial: () => 100 + Math.random() * 900, decimals: 0 },
        { shorthand: "V", label: "Voltage", initial: () => 220 + Math.random() * 10, decimals: 2 },
        { shorthand: "A", label: "Current", initial: () => 5 + Math.random() * 5, decimals: 2 },
        { shorthand: "kg", label: "Weight", initial: () => 50 + Math.random() * 50, decimals: 1 },
        { shorthand: "m", label: "Altitude", initial: () => 100 + Math.random() * 1000, decimals: 0 },
        { shorthand: "km/h", label: "Speed", initial: () => 20 + Math.random() * 80, decimals: 1 },
      ];

      // Randomly select a unit
      const selectedUnit = units[Math.floor(Math.random() * units.length)];

      // Generate initial value
      const initialValue = selectedUnit.initial();

      return {
        unit: selectedUnit.shorthand,
        label: selectedUnit.label,
        value: parseFloat(initialValue.toFixed(selectedUnit.decimals)), // Ensure concise decimal format
        decimals: selectedUnit.decimals,
      };
    }

    let measurement = getRandomTimeSeriesData();

    let barGraph = Math.random() < 0.2;

    const markareaOptions = [
      [
        { markAreaMax: measurement.value + 0.3, markAreaColor: "g" },
        { markAreaMin: measurement.value + 0.3, markAreaMax: measurement.value + 0.6, markAreaColor: "y" },
        { markAreaMin: measurement.value + 0.6, markAreaColor: "r" },
      ],
      [
        { markAreaMax: measurement.value + 0.3, markAreaColor: "r" },
        { markAreaMin: measurement.value + 0.3, markAreaMax: measurement.value + 0.7, markAreaColor: "y" },
        { markAreaMin: measurement.value + 0.7, markAreaColor: "g" },
      ],
      null,
    ];

    const selectedMarkarea = barGraph
      ? markareaOptions[2] // Always choose the last option if `barGraph` is true
      : markareaOptions[Math.floor(Math.random() * 3)]; // 1/3 chance for each option



    const newDataKey = {
      dataKey: {
        label: measurement.label,
        units: measurement.unit,
        decimals: measurement.decimals,
        color: Math.random() < 0.5
          ? `hsl(${Math.floor(Math.random() * 360)}, 100%, ${Math.floor(40 + Math.random() * 8)}%)`
          : null,
        settings: {
          isBarGraph: barGraph,
          showMin: Math.random() < 0.5,
          showMax: Math.random() < 0.5,
          showAvg: Math.random() < 0.5,
          // showSum: barGraph && Math.random() < 0.5,
          markAreas: selectedMarkarea,
        },
      },
    };

    // Add new dataKey and corresponding data
    setDataKeys((prev) => [...prev, newDataKey]);

    let initialDataValue = measurement.value;
    const newSeries = Array(20)
      .fill(null)
      .map((_, i) => [Date.now() - (20 - i) * 20000, initialDataValue + Math.random() * 1.5]);

    setData((prev) => [...prev, newSeries]);

    // Update the ref for live data updates
    dataRef.current = [...dataRef.current, newSeries];
  };


  const removeDataKey = () => {
    if (dataKeys.length > 0) {
      setDataKeys((prev) => prev.slice(0, -1)); // Remove the last dataKey
      setData((prev) => prev.slice(0, -1)); // Remove the last data series
      dataRef.current = dataRef.current.slice(0, -1); // Update the ref for consistency
    } else {
      console.warn("No DataKeys to remove");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={addDataKey}
        style={{
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "10px 20px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Add DataKey
      </button>
      <button
        onClick={removeDataKey}
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "10px 20px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Remove DataKey
      </button>
      <div
        style={{
          height: "400px",
          width: "600px",
          boxSizing: "border-box",
        }}
      >
        <MultiTimeSeries
          data={data}
          dataKeys={dataKeys}
          settings={settings}
          minTime={Date.now() - 600000}
          maxTime={Date.now()}
        />
      </div>
    </div>
  );
};

export default MultiTimeSeriesEditor;
