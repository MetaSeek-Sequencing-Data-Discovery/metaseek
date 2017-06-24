import React, {Component} from 'react';
var Plotly = window.Plotly;

var Plot = React.createClass({
   componentDidMount() {
     Plotly.newPlot('plottest', [{
      x: [0,5,10,15],
      y: [-1,5,20,-2],
      type: 'scatter'
    }], {
      margin: {
        t: 0, r: 0, l: 30
      },
      xaxis: {
        gridcolor: 'transparent'
      }
    }, {
      displayModeBar: false
    });
   },

  render : function() {
    return (
      <div id="plottest"></div>
    );
  }
});

export default Plot;
