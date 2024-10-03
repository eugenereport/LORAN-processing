export class LORANGraph {

  // Initializes graph configuration
  constructor(plotId) {
    this.started = false;
    this.trace_set = new Set();
    this.plotId = plotId;

    this.layout = {
      title: "LORAN",
      xaxis: {
        title: "X Axis",
        showgrid: true,
        zeroline: true,
        gridcolor: "#444444",
        zerolinecolor: "#888888",
        tickmode: "linear",
        tick0: 0,
        dtick: 10,
        range: [0, 100],
      },
      yaxis: {
        title: "Y Axis",
        showgrid: true,
        zeroline: true,
        gridcolor: "#444444",
        zerolinecolor: "#888888",
        tickmode: "linear",
        tick0: 0,
        dtick: 10,
        range: [0, 100],
      },
      width: 720,
      height: 500,
      plot_bgcolor: "#131416",
      paper_bgcolor: "#131416",
      font: {
        color: "lime",
        size: 10,
      },
      margin: {
        r: 350,
      },
    };
  }

  // Updates graph configuration based on new data
  updateConfiguration(config) {
    let width = config.LORANService.emulationZoneSize.width;
    this.layout.xaxis.range = [0, width];
    this.layout.xaxis.dtick = width / 10;

    let height = config.LORANService.emulationZoneSize.height;
    this.layout.yaxis.range = [0, height];
    this.layout.yaxis.dtick = height / 10;
  }

  // Initializes the graph with GPS storage and starts rendering
  init(LORANStorage_) {
    this.storage = LORANStorage_;

    setInterval(() => {
      this.render();
      let traces = [...this.trace_set];
      Plotly.newPlot(this.plotId, traces, this.layout);
    }, 20);

    this.started = true;
  }

  // Renders graph data by plotting object and satellite positions
  render() {
    this.trace_set = new Set();

    const positionData = this.storage.getCurrentData();
    
    // Plot object position
    if (positionData.calculatedPoint) {
      const { x, y } = positionData.calculatedPoint;

      let pointColor = "gray";
      if (positionData.pointStatus === "new") {
        pointColor = "lime";
      }

      const objectTrace = {
        x: [x],
        y: [y],
        mode: "markers",
        type: "scatter",
        marker: { size: 10, color: pointColor, symbol: "cross" },
        opacity: 1,
        name: `Object (${positionData.pointStatus}) (${x.toFixed(3)}, ${y.toFixed(3)})`,
      };

      this.trace_set.add(objectTrace);
    }

    // Plot station data
    positionData.stations.forEach((station, index) => {
      let stationColor = "gray";
      let stationSymbol = "square";

      if (station.status === "received") {
        stationColor = "orange";
        stationSymbol = "circle";
      }

      const satTrace = {
        x: [station.coords.x],
        y: [station.coords.y],
        mode: "markers",
        type: "scatter",
        marker: { size: 7, color: stationColor, symbol: stationSymbol },
        opacity: 1,
        name: `Station ${index + 1} (${station.status === "received" ? "synchronized" : "not synchronized"}) (x: ${station.coords.x.toFixed(3)}, y: ${station.coords.y.toFixed(3)})`,
      };

      this.trace_set.add(satTrace);
    });
  }

}
