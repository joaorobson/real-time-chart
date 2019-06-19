import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import io from 'socket.io-client';

const indexPadding = 1;

const yAxesConfig = () => [
  {
    scaleLabel: {
      display: true,
      labelString: "data"
    },
    ticks: {
      max: 42,
      min: 1,
      stepSize: 6 
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
    this.socket = io('https://magrathea-io.herokuapp.com/');
    this.sensor1 = [];
  }

  componentDidMount() {
    this.socket.on("data", data => {
      this.sensor1.push(parseInt(data.data))
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
