import React from 'react';
import rd3 from 'rd3';

const BarChart = rd3.BarChart;

var barData = [
  {
    "name": "Series A",
    "values": [
      { "x": 1, "y":  91},
      { "x": 2, "y": 290},
      { "x": 3, "y": -25},
    ]
  },
  {
    "name": "Series B",
    "values": [
      { "x": 1, "y":  9},
      { "x": 2, "y": 49},
      { "x": 3, "y": -20},
    ]
  },
  {
    "name": "Series C",
    "values": [
      { "x": 1, "y":  14},
      { "x": 2, "y": 77},
      { "x": 3, "y": -70},
    ]
  }
];

var Histogramrd3 = React.createClass({
  getInitialState : function() {
    return {
      "data":[],
      "counts":[]
    }
  },

  render: function() {
    return  (
    	<BarChart
      data={barData}
      width={500}
      height={300}
      title="Bar Chart"
      xAxisLabel="Value"
      yAxisLabel="Label"
      />
  )}
});
  
export default Histogramrd3;
