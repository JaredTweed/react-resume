import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { v4 as uuidv4 } from 'uuid';

/**
 * MultiTimeSeries
 *
 * Renders multiple stacked ECharts line/bar charts along with a “value box” on the left.
 * Includes optional tooltip synchronization between charts via a Web Worker.
 *
 * @param {Object} props
 * @param {Object[]} props.data               - The actual timeseries data; you must shape it so each dataKey has an array of [timestamp, value].
 * @param {Object[]} props.dataKeys           - An array describing each dataKey. Each item might look like:
 *                                               {
 *                                                 dataKey: {
 *                                                   label: 'My Label',
 *                                                   color: '#00FF00',
 *                                                   units: 'kW',
 *                                                   decimals: 2,
 *                                                   settings: {
 *                                                     isBarGraph: false,
 *                                                     showMin: false,
 *                                                     showMax: false,
 *                                                     showAvg: false,
 *                                                     showSum: false,
 *                                                     yAxisMin: 0,
 *                                                     yAxisMax: 0,
 *                                                     markAreas: [ ... ]
 *                                                   }
 *                                                 }
 *                                               }
 * @param {Object} props.settings             - Global settings (similar to self.ctx.settings). E.g.:
 *                                               {
 *                                                 showMouseHeight: true,
 *                                                 showMin: true,
 *                                                 showMax: true,
 *                                                 showAvg: false,
 *                                                 showSum: false,
 *                                                 syncTooltips: true,
 *                                                 lineColor: '#000000'
 *                                               }
 * @param {number} props.minTime              - The minimum timestamp (ms) from your time window.
 * @param {number} props.maxTime              - The maximum timestamp (ms) from your time window.
 */
export default function MultiTimeSeries({
  data = [],
  dataKeys = [],
  settings = {},
  minTime,
  maxTime
}) {
  // Unique ID for the whole container to ensure we don't collide with other DOM elements.
  const [uniqueId] = useState(() => `chartContainer_${uuidv4()}`);

  // We'll store references to each ECharts instance and each "valueBox" container.
  const chartRefs = useRef([]);        // array of { domRef, chartInstance }
  const containerRef = useRef(null);   // The main big container (equivalent to self.ctx.$container)
  const [maxLegendWidth, setMaxLegendWidth] = useState(70); // Default left box width
  const [chartDataList, setChartDataList] = useState([]);   // Storing arrays-of-arrays data for each chart
  const spaceBetweenCharts = 10;
  const additionalHeight = 20;         // Space for x-axis on last chart

  // ---------------------------------
  // 1) On first render, create the DOM structure for each chart
  //    We'll do this via .map in the JSX. Each chart will be in a row:
  //    [valueBox] [chart]
  // ---------------------------------

  // ---------------------------------
  // 2) The big effect that:
  //    - Inits each ECharts instance or updates if data changes
  //    - Measures legend widths
  //    - Calls syncTooltips if needed
  // ---------------------------------
  useEffect(() => {
    // Ensure chartRefs is sized to the dataKeys array
    if (chartRefs.current.length !== dataKeys.length) {
      chartRefs.current = dataKeys.map(() => ({ domRef: null, chartInstance: null }));
    }

    // Parse data and find min/max timestamps
    let globalMinX = Infinity;
    let globalMaxX = -Infinity;

    // Build chartDataList in the shape [ [ [Date, value], [Date, value], ... ], ... ]
    const newChartDataList = dataKeys.map((dk, i) => {
      const { dataKey } = dk;
      // The "i"th dataKey's array is found at data[i], or you can match by label
      // if your `data` prop is shaped that way. Adjust as needed:
      const arr = data[i] || [];

      // Convert numeric timestamps => Date
      const converted = arr.map((entry) => {
        const [ts, val] = entry;
        if (ts < globalMinX) globalMinX = ts;
        if (ts > globalMaxX) globalMaxX = ts;
        return [new Date(ts), val];
      });

      return converted;
    });

    setChartDataList(newChartDataList);

    // If your time window is external, you might prefer minTime / maxTime from props
    const theMinTime = minTime !== undefined ? minTime : globalMinX;
    const theMaxTime = maxTime !== undefined ? maxTime : globalMaxX;

    // ---------------
    // 2.1) For each chart, build the ECharts option & set it
    // ---------------
    dataKeys.forEach((dk, i) => {
      const { dataKey } = dk;
      const lineColor = pickLineColor(i, dataKey, settings); // see helper below

      const chartRefObj = chartRefs.current[i];
      if (!chartRefObj || !chartRefObj.domRef) return;

      let chartInstance = chartRefObj.chartInstance;
      if (!chartInstance) {
        // init the chart instance
        chartInstance = echarts.init(chartRefObj.domRef);
        chartRefObj.chartInstance = chartInstance;
      }

      // Build the main series from the data
      const isBar = dataKey.settings?.isBarGraph;
      const mainSeries = {
        type: isBar ? 'bar' : 'line',
        data: newChartDataList[i],
        showSymbol: false,
        lineStyle: {
          width: 1.5,
          color: lineColor,
          shadowColor: 'rgba(0, 0, 0, 0.35)',
          shadowBlur: 10,
          shadowOffsetY: 2
        },
        itemStyle: {
          color: lineColor
        }
      };

      // Apply custom Y-axis min/max
      const [graphMin, graphMax] = computeYAxisRange(dk, newChartDataList[i]);

      // Combine possible mark-area series
      const markAreaSeries = pushMarkAreasSeries(dk, data, dataKeys);

      const allSeries = [mainSeries, ...markAreaSeries];

      // Determine tooltip font size based on chart width
      const cWidth = chartInstance.getDom()?.clientWidth || 200;
      const tooltipFontSize = Math.max(10, Math.min(cWidth / 35, 12));

      const chartOption = {
        xAxis: {
          type: 'time',
          axisLabel: {
            show: i === dataKeys.length - 1, // only show x-axis on the last chart
            color: '#000',
            formatter: (value) => formatXAxisLabel(value, theMinTime, theMaxTime)
          },
          axisLine: { show: true },
          splitLine: {
            show: true,
            lineStyle: { color: '#aaa' }
          },
          min: theMinTime,
          max: theMaxTime
        },
        yAxis: {
          type: 'value',
          position: 'right',
          axisLabel: { show: true },
          axisLine: { show: true },
          splitLine: { show: true },
          min: graphMin,
          max: graphMax
        },
        grid: {
          left: 7,
          right: 2,
          top: 0,
          bottom: i === dataKeys.length - 1 ? additionalHeight : 1
        },
        tooltip: {
          trigger: 'axis',
          triggerOn: 'mousemove|click',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderWidth: 0,
          padding: 5,
          textStyle: { color: '#fff', fontSize: tooltipFontSize, align: 'left' },
          position: function (pos, params, dom, rect, size) {
            // Custom position logic to nudge tooltip left or right
            const indexPos =
              ((params[0].axisValue - theMinTime) / (theMaxTime - theMinTime)) *
              size.viewSize[0];
            const defaultPosition = indexPos + 15;
            const altPosition = indexPos - 10 - size.contentSize[0];
            if (defaultPosition + size.contentSize[0] > size.viewSize[0]) {
              return { top: 0, left: altPosition };
            }
            return { top: 0, left: defaultPosition };
          },
          formatter: (params) => {
            if (!params.length) return '';
            // First param gives the date
            const dateObj = new Date(params[0].axisValue);
            const dateStr = `${dateObj.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })} ${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
            const tipLines = params.map((p) => {
              const val = p.value[1];
              const c = lineColor;
              const colorBorder = isColorDark(c) ? 'border: 1px solid grey;' : '';
              return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${c};${colorBorder}"></span>
                ${formatNumberWithCommas(val.toFixed(dataKeyDecimals(dataKey)))}${dataKeyUnits(dataKey)}`;
            });
            // Optionally append the "Cursor Height" if showMouseHeight
            return `${dateStr}<br/>${tipLines.join('<br/>')}<br/>${chartInstance.myMouseLocation || ''}`;
          }
        },
        series: allSeries
      };

      chartInstance.setOption(chartOption);
      updateXAxisSplitNumber();
      chartInstance.resize();
    });

    // ---------------
    // 2.2) For each "valueBox", compute HTML content and measure width
    // ---------------
    const showAllData = computeShowAllData(dataKeys, settings);

    const legendWidths = [];
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.whiteSpace = 'nowrap';
    document.body.appendChild(tempContainer);
    dataKeys.forEach((dk, i) => {
      const valueBoxEl = document.getElementById(`valueBox_${i}_${uniqueId}`);
      if (!valueBoxEl) return;

      // Generate content and append to tempContainer
      const html = buildValueBoxHTML(dk, chartDataList[i], settings);
      tempContainer.innerHTML = html;
      valueBoxEl.innerHTML = html;

      // Measure natural width
      legendWidths[i] = tempContainer.offsetWidth;
      // legendWidths[i] = valueBoxEl.scrollWidth;
    });
    document.body.removeChild(tempContainer); // Cleanup temporary container
    const newMaxWidth = legendWidths.length
      ? Math.max(...legendWidths)
      : maxLegendWidth;
    if (newMaxWidth !== maxLegendWidth) {
      setMaxLegendWidth(newMaxWidth);
      console.log(legendWidths);
    }

    // ---------------
    // 2.3) If syncTooltips is enabled and we have multiple charts, set up tooltip sync
    // ---------------
    if (settings.syncTooltips && dataKeys.length > 1) {
      synchronizeTooltips(chartRefs.current, newChartDataList);
    }

    // ---------------
    // 2.4) If showMouseHeight is true, set up mousemove
    // ---------------
    if (settings.showMouseHeight) {
      chartRefs.current.forEach((chartRefObj, i) => {
        const chartInstance = chartRefObj.chartInstance;
        if (!chartInstance) return;
        const dataKeyObj = dataKeys[i];

        chartInstance.myMouseLocation = '';
        chartInstance.getZr()?.on?.('mousemove', function (params) {
          const pointInPixel = [params.offsetX, params.offsetY];
          const pointInGrid = chartInstance.convertFromPixel(
            { seriesIndex: 0 },
            pointInPixel
          );
          if (pointInGrid && pointInGrid.length > 1) {
            chartInstance.myMouseLocation = `Cursor Height: ${formatNumberWithCommas(
              pointInGrid[1].toFixed(dataKeyDecimals(dataKeyObj.dataKey))
            )}${dataKeyUnits(dataKeyObj.dataKey)}`;
            // Clear others
            chartRefs.current.forEach((other, idx) => {
              if (other.chartInstance && idx !== i) {
                other.chartInstance.myMouseLocation = '';
              }
            });
          }
        });
      });
    }
  }, [
    data,
    dataKeys,
    settings,
    minTime,
    maxTime,
    uniqueId,
    maxLegendWidth /* we set it from inside but including so effect re-runs for resizing */
  ]);

  // ---------------------------------
  // 3) On window resize, call chart.resize()
  //    (You can also use ResizeObserver if you prefer.)
  // ---------------------------------
  useEffect(() => {
    function handleResize() {
      chartRefs.current.forEach((refObj) => {
        if (refObj.chartInstance) {
          refObj.chartInstance.resize();
        }
      });
      updateXAxisSplitNumber();
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ---------------------------------
  // 4) Cleanup on unmount
  // ---------------------------------
  useEffect(() => {
    return () => {
      chartRefs.current.forEach((refObj) => {
        if (refObj.chartInstance) {
          refObj.chartInstance.dispose();
          refObj.chartInstance = null;
        }
      });
    };
  }, []);

  // ---------------------------------
  // 5) Render the big container
  //    We'll create rows for each dataKey:
  //       <div style='display:flex'>
  //         <div id="valueBox_i_uniqueId" .../>
  //         <div id="chart_i_uniqueId" ref=.../>
  //       </div>
  //    If you do NOT show all data, we optionally add a "Latest" box at the bottom
  // ---------------------------------
  const showAllData = computeShowAllData(dataKeys, settings);

  function updateXAxisSplitNumber() {
    chartRefs.current.forEach((refObj) => {
      const chartInstance = refObj.chartInstance;
      if (!chartInstance) return;

      // Get the width of the chart container
      const chartWidth = chartInstance.getDom()?.clientWidth || 0;

      // Calculate splitNumber based on chart width
      const splitNumber = Math.max(Math.floor(chartWidth / 120), 2); // Adjust 120 as needed for your layout

      // Update the chart options with the new splitNumber
      chartInstance.setOption({
        xAxis: {
          splitNumber: splitNumber,
        },
      });
    });
  }

  return (
    <div
      id={uniqueId}
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "15px"
      }}
    >
      {dataKeys.map((dk, i) => {
        // If it's the last chart, add additional space for x-axis
        const heightCalc = `calc((100% - ${spaceBetweenCharts * (dataKeys.length - 1) + additionalHeight
          }px) / ${dataKeys.length})`;
        const isLast = i === dataKeys.length - 1;

        return (
          <div
            key={i}
            style={{
              width: '100%',
              height: isLast
                ? `calc(${heightCalc} + ${additionalHeight}px)`
                : heightCalc,
              display: 'flex',
              alignItems: 'start',
              marginBottom: isLast ? 0 : spaceBetweenCharts
            }}
          >
            {/* Value box */}
            <div
              id={`valueBox_${i}_${uniqueId}`}
              style={{
                width: `${maxLegendWidth}px`,
                height: isLast
                  ? `calc(100% - ${additionalHeight}px)`
                  : "100%",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                verticalAlign: 'middle',
                border: '1px solid #000',
                borderRadius: '8px',
                color: "black",
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '0px',
                overflow: 'hidden' // in case text is large
              }}
            />
            {/* Chart container */}
            <div
              id={`chart_${i}_${uniqueId}`}
              style={{
                width: `calc(100% - ${maxLegendWidth}px)`,
                height: '100%'
              }}
              ref={(el) => {
                // Keep track of the DOM ref for ECharts
                if (!chartRefs.current[i]) {
                  chartRefs.current[i] = { domRef: el, chartInstance: null };
                } else {
                  chartRefs.current[i].domRef = el;
                }
              }}
            />
          </div>
        );
      })}
      {/* Only show "Latest" box if user is NOT showing all data */}
      {!showAllData && (
        <div
          style={{
            width: `${maxLegendWidth}px`,
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: `${5 - additionalHeight}px`,
            marginBottom: '0px',
            border: '1px solid #000',
            borderRadius: '8px',
            color: 'black'
          }}
        >
          Latest
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------

/** 
 * Decide whether to display min/max/avg/sum in every legend
 * or rely on each dataKey’s own .settings
 */
function computeShowAllData(dataKeys, settings) {
  let showAll = settings.showMin || settings.showMax || settings.showAvg || settings.showSum;
  dataKeys.forEach((dk) => {
    const s = dk.dataKey.settings || {};
    if (s.showMin || s.showMax || s.showAvg || s.showSum) {
      showAll = true;
    }
  });
  return showAll;
}

/** 
 * Renders the innerHTML for the left "valueBox". 
 * In the original code, you used showAllData to decide 
 * if you only show the "Latest" or show min/max/avg/sum, etc. 
 */
function buildValueBoxHTML(dk, keyData, settings, showAll) {
  const dataKey = dk.dataKey;
  const label = dataKey.label || 'No Title';
  const decimals = dataKeyDecimals(dataKey);
  const units = dataKeyUnits(dataKey);

  if (!keyData || !keyData.length) {
    return `
      <div style="display: flex; flex-direction: column;">
        <span style="white-space: nowrap; overflow: hidden; font-weight: bold;">
          ${label}
        </span>
        <span style="white-space: nowrap; overflow: hidden; font-weight: normal;">
          No Data
        </span>
      </div>
    `;
  }

  const numericValues = keyData.map((pt) => pt[1]);
  const latestValue = numericValues[numericValues.length - 1].toFixed(decimals);
  const minValue = Math.min(...numericValues).toFixed(decimals);
  const maxValue = Math.max(...numericValues).toFixed(decimals);
  const avgValue = (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(decimals);
  const sumValue = numericValues.reduce((a, b) => a + b, 0).toFixed(decimals);

  // Check if global or local settings want min/max/avg/sum
  const wantMin = settings.showMin || dataKey.settings?.showMin;
  const wantMax = settings.showMax || dataKey.settings?.showMax;
  const wantAvg = settings.showAvg || dataKey.settings?.showAvg;
  const wantSum = settings.showSum || dataKey.settings?.showSum;

  if (!showAll) {
    // Show only label + latest
    return `
      <div style="padding: 5px;">
        <div style="font-weight: bold; white-space: nowrap; overflow: hidden;">
          ${label}
        </div>
        <div style="white-space: nowrap; overflow: hidden;">
          ${formatNumberWithCommas(latestValue)}${units}
        </div>
      </div>
    `;
  } else {
    // Show label + all configured stats
    const row = (title, val) => `
      <div style="display: table-row;">
        <span style="display: table-cell; padding-right: 10px; white-space: nowrap;">${title}:</span>
        <span style="display: table-cell; text-align: right; white-space: nowrap;">${val}</span>
      </div>
    `;
    const minHTML = wantMin ? row('Min', formatNumberWithCommas(minValue) + units) : '';
    const maxHTML = wantMax ? row('Max', formatNumberWithCommas(maxValue) + units) : '';
    const avgHTML = wantAvg ? row('Avg', formatNumberWithCommas(avgValue) + units) : '';
    const sumHTML = wantSum ? row('Sum', formatNumberWithCommas(sumValue) + units) : '';

    return `
      <div style="padding: 5px;">
        <strong style="font-weight: 800; display: block; white-space: nowrap; overflow: hidden;">
          ${label}
        </strong>
        <div style="font-size: 13px; text-align: center; font-weight: normal;">
          <div style="display: table; margin: 0 auto;">
            ${row('Latest', formatNumberWithCommas(latestValue) + units)}
            ${minHTML}
            ${maxHTML}
            ${avgHTML}
            ${sumHTML}
          </div>
        </div>
      </div>
    `;
  }
}

/** 
 * Picks thr line color from the dataKey, falls back to the settings.lineColor, defaults to black.
 */
function pickLineColor(index, dataKey, settings) {
  let defaultColor = dataKey?.color || dataKey.dataKey?.color || settings.lineColor || '#000000';
  return defaultColor;
}

/** 
 * figure out the min and max to use on the Y axis
 */
function computeYAxisRange(dk, dataArr) {
  const dataKey = dk.dataKey;
  let dataMin = 0;
  let dataMax = 1;
  if (dataArr && dataArr.length > 0) {
    dataMin = Math.min(...dataArr.map((d) => d[1]));
    dataMax = Math.max(...dataArr.map((d) => d[1]));
  }
  const sMin = dataKey.settings?.yAxisMin;
  const sMax = dataKey.settings?.yAxisMax;

  const graphMin = sMin != null ? Math.min(sMin, dataMin) : dataMin;
  const graphMax = sMax != null ? Math.max(sMax, dataMax) : dataMax;

  return [graphMin, graphMax];
}


/**
 * Using your MarkAreas logic from pushMarkAreasSeries. 
 * We pass in the entire data array & dataKeys so we can find 
 * min/max pairs. You’ll need to adapt if your data shape differs.
 */
function pushMarkAreasSeries(dk, allData, allDataKeys) {
  const dataKey = dk.dataKey;

  // Check if dataKey or dataKey.label is undefined/null
  if (!dataKey || !dataKey.label) {
    console.warn("Missing dataKey or dataKey.label:", dataKey);
    return [];
  }

  const baseLabel = dataKey.label.replace(/-(g|y|p|r)-(min|max)$/, '');

  // Check if this dataKey is a "min/max" key
  if (dataKey.label.match(/-(g|y|p|r)-(min|max)$/)) {
    return [];
  }

  // Define the color map
  const colorMap = {
    g: 'rgba(0, 150, 0, 0.30)',
    y: 'rgba(255, 255, 0, 0.30)',
    p: 'rgba(130, 50, 200, 0.30)',
    r: 'rgba(255, 0, 0, 0.30)'
  };

  const markAreaKeysData = [];

  // Filter valid markAreaDataKeys
  const markAreaDataKeys = allDataKeys.filter(
    (k) => k.dataKey?.label?.match(/-(g|y|p|r)-(min|max)$/)
  );

  markAreaDataKeys.forEach((mk) => {
    const mkLabel = mk.dataKey.label;
    const colorMatch = mkLabel.match(/^(.+)-(\d+)-(g|y|p|r)-(min|max)$/);
    if (!colorMatch) return;

    const [_, label, seed, colorChar, type] = colorMatch;
    if (label !== baseLabel) return;

    const oppositeType = type === 'min' ? 'max' : 'min';
    const oppositeKey = `${baseLabel}-${seed}-${colorChar}-${oppositeType}`;

    // Find indices for current and opposite keys
    const currentDataKeyIndex = allDataKeys.findIndex(
      (x) => x.dataKey?.label === mkLabel
    );
    const oppositeIndex = allDataKeys.findIndex(
      (x) => x.dataKey?.label === oppositeKey
    );

    let cVal = null;
    if (currentDataKeyIndex >= 0 && allData[currentDataKeyIndex]?.length) {
      const arr = allData[currentDataKeyIndex];
      cVal = arr[arr.length - 1][1];
    }

    let oVal = null;
    if (oppositeIndex >= 0 && allData[oppositeIndex]?.length) {
      const arr2 = allData[oppositeIndex];
      oVal = arr2[arr2.length - 1][1];
    }

    if (cVal == null) return;

    const minValue = type === 'min' ? cVal : oVal !== null ? oVal : -Infinity;
    const maxValue = type === 'max' ? cVal : oVal !== null ? oVal : Infinity;

    if (minValue != null) {
      markAreaKeysData.push([
        {
          yAxis: minValue,
          itemStyle: {
            color: colorMap[colorChar]
          }
        },
        {
          yAxis: maxValue
        }
      ]);
    }
  });

  const customMarkAreas = dataKey.settings?.markAreas || [];
  const markAreaSettingsData = customMarkAreas.map((marker) => {
    const c = marker.markAreaColor?.[0];
    const cKey = colorMap[c?.toLowerCase?.()] || 'rgba(0,0,0,0.1)';
    return [
      {
        yAxis: marker.markAreaMin ?? -Infinity,
        itemStyle: {
          color: cKey
        }
      },
      {
        yAxis: marker.markAreaMax ?? Infinity
      }
    ];
  });

  const combined = [...markAreaKeysData, ...markAreaSettingsData];

  if (!combined.length) return [];

  return [
    {
      name: 'MarkAreas',
      type: 'line',
      data: [],
      markArea: {
        data: combined,
        silent: true
      },
      itemStyle: { opacity: 0 },
      lineStyle: { opacity: 0 }
    }
  ];
}


/** 
 * Format an X-axis label depending on time range.
 */
function formatXAxisLabel(value, minT, maxT) {
  const date = new Date(value);
  const diff = maxT - minT;

  if (diff <= 4 * 60 * 1000) {
    // If the range is within 4 minutes -> HH:MM:SS
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(
      date.getSeconds()
    ).padStart(2, '0')}`;
  } else if (diff <= 24 * 60 * 60 * 1000) {
    // If within 1 day -> HH:MM
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  } else {
    // Larger range
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (diff <= 365 * 24 * 60 * 60 * 1000) {
      // up to a year -> MMM DD
      return `${months[date.getMonth()]} ${date.getDate()}`;
    } else {
      // > a year -> MMM YYYY
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  }
}

/** 
 * Return the number of decimals for a dataKey.
 */
function dataKeyDecimals(dk) {
  if (!dk) return 0;
  return dk.decimals !== undefined ? dk.decimals : dk.dataKey?.decimals || 0;
}

/** 
 * Return the units for a dataKey.
 */
function dataKeyUnits(dk) {
  if (!dk) return '';
  return dk.units ? ' ' + dk.units : dk.dataKey?.units ? ' ' + dk.dataKey.units : '';
}

/** 
 * Simple commas for thousands
 */
function formatNumberWithCommas(num) {
  const numStr = typeof num === 'number' ? num.toString() : num;
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 
 * A quick brightness check for the color to see if it’s “dark”.
 */
function isColorDark(color) {
  // Named colors, or hex, or rgb
  const colorNames = {
    black: [0, 0, 0],
    white: [255, 255, 255],
    red: [255, 0, 0],
    green: [0, 128, 0],
    blue: [0, 0, 255],
    yellow: [255, 255, 0],
    magenta: [255, 0, 255],
    cyan: [0, 255, 255],
    gray: [128, 128, 128]
  };

  let r, g, b;
  if (colorNames[color?.toLowerCase()]) {
    [r, g, b] = colorNames[color.toLowerCase()];
  } else if (color.startsWith('#')) {
    let c = color.substring(1);
    if (c.length === 3) {
      c = c.split('').map((hex) => hex + hex).join('');
    }
    r = parseInt(c.substring(0, 2), 16);
    g = parseInt(c.substring(2, 4), 16);
    b = parseInt(c.substring(4, 6), 16);
  } else {
    // fallback to rgb(...) format
    const rgb = color.match(/\d+/g);
    r = parseInt(rgb[0]);
    g = parseInt(rgb[1]);
    b = parseInt(rgb[2]);
  }
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 80;
}

//
// -------------------------------------------------------------------
// ---------------------  TOOLTIP SYNC  ------------------------------
// -------------------------------------------------------------------
//

/**
 * Synchronize tooltips across multiple ECharts instances.
 * This replicates your original “synchronizeTooltips(charts)” code,
 * but adapted for React. We do it all inline here.
 *
 * @param {Array} chartRefs - array of { chartInstance, domRef }
 * @param {Array} chartDataList - array of arrays (the data for each chart)
 */
function synchronizeTooltips(chartRefs, chartDataList) {
  let isTooltipShown = false;
  let selectedIndex = -1;
  let isSyncing = false;
  let inputChartIndex = null;

  // Create the inline worker from a Blob
  const workerCode = `
    onmessage = function(event) {
      const { chartDataList, targetDate } = event.data;
      let closestIndex = [];
      for (let chartIndex = 0; chartIndex < chartDataList.length; chartIndex++) {
        let arr = chartDataList[chartIndex];
        let low = 0;
        let high = arr.length - 1;
        closestIndex[chartIndex] = 0;
        let closestDiff = Infinity;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const midDate = new Date(arr[mid][0]).getTime();
          const currentDiff = Math.abs(midDate - targetDate);
          if (currentDiff < closestDiff) {
            closestDiff = currentDiff;
            closestIndex[chartIndex] = mid;
          }
          if (midDate < targetDate) {
            low = mid + 1;
          } else if (midDate > targetDate) {
            high = mid - 1;
          } else {
            break;
          }
        }
      }
      postMessage({ closestIndex });
    }
  `;
  const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(workerBlob));

  worker.onmessage = function (event) {
    const { closestIndex } = event.data;
    if (isSyncing && isTooltipShown) {
      // Show tooltip for all charts
      chartRefs.forEach((refObj, otherIndex) => {
        if (!refObj.chartInstance) return;
        if (otherIndex !== inputChartIndex) {
          refObj.chartInstance.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: closestIndex[otherIndex]
          });
        }
      });
      isSyncing = false;
    }
  };

  function showTipHandler(params, index) {
    if (isSyncing) return;
    inputChartIndex = index;
    isSyncing = true;
    isTooltipShown = true;
    selectedIndex = params.dataIndex;

    const targetDate = new Date(chartDataList[inputChartIndex][selectedIndex][0]).getTime();
    worker.postMessage({ chartDataList, targetDate });
  }

  function hideTipHandler() {
    if (isSyncing) return;
    isSyncing = true;
    isTooltipShown = false;
    selectedIndex = -1;

    // Hide tooltip for all charts
    chartRefs.forEach((refObj) => {
      if (!refObj.chartInstance) return;
      refObj.chartInstance.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: -1
      });
    });
    isSyncing = false;
  }

  chartRefs.forEach((refObj, index) => {
    const ch = refObj.chartInstance;
    if (!ch) return;

    ch.off('showTip'); // remove old if any
    ch.off('hideTip');

    ch.on('showTip', (params) => showTipHandler(params, index));
    ch.on('hideTip', () => hideTipHandler());
  });
}
