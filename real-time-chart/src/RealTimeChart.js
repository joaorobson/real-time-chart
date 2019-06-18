import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import * as emitter from "emitter-io";

const indexPadding = 1;

const yAxesConfig = () => [
  {
    scaleLabel: {
      display: true,
      labelString: "mv"
    },
    ticks: {
      max: 500,
      min: 1,
      stepSize: 50
    }
  }
];

const tooltipsConfig = () => ({
  enabled: false,
  mode: "nearest",
  intersect: false
});

const sensorConfig = (label, color) => ({
  label,
  fill: false,
  cubicInterpolationMode: "monotone",
  backgroundColor: color,
  borderColor: color
});

const datasets = () => {
  return {
    datasets: [
      {
        ...sensorConfig("random data", "#00004d"),
        data: []
      }
    ]
  };
};

class RealTimeChart extends React.Component {
  constructor(props) {
    super(props);
    this.client = emitter.connect({
      host: "127.0.0.1",
      port: 8080,
      secure: false
    });
    this.client.subscribe({
      key: "NV0RKrY3_qOcLTRnDMyOZ5cGU1vNYEjC",
      channel: "chart/"
    });
    this.sensor1 = [];
  }

  componentDidMount() {
    this.client.on("message", msg => {
      this.sensor1.push(parseInt(msg.asString()))
      console.log(msg.asString())
    });

  }

  render() {
    return (
      <Line
        data={datasets()}
        options={{
          maintainAspectRatio: false,
          title: {
            display: false
          },
          legend: {
            display: true
          },
          scales: {
            xAxes: [
              {
                type: "realtime",
                maxBarThickness: 3,
                gridLines: {
                  display: true
                },
                realtime: {
                  duration: 20000,
                  delay: 1000,
                  refresh: 500,
                  onRefresh: chart => {
                    chart.data.datasets.forEach((dataset, index) => {
                      dataset.data.push({
                        x: Date.now(),
                        y: this.sensor1[this.sensor1.length - indexPadding]
                      });
                    });
                  }
                }
              }
            ],
            yAxes: yAxesConfig()
          },
          tooltips: tooltipsConfig()
        }}
      />
    );
  }
}

export default RealTimeChart;
