import React from 'react';
import d3 from 'd3';
import MapRect from './MapRect';

const MapDataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    gridSize_x: React.PropTypes.number,
    gridSize_y: React.PropTypes.number,
    fill: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      data: []
    };
  },

  render() {
    let {data, gridSize_x, gridSize_y, fill} = this.props;

    var colorScale = d3.scale.linear()
  	.domain([0, d3.max(data, function(d) {return d.count; })])
  	.range(["#FFFFFF", "#6369E0"])
    console.log(colorScale);
    console.log(d3.max(data.map(function(d) {return d.count; })));
    console.log(colorScale(100));
    console.log(data.map(function(d) {return d.count; }))

    let rectangle = data.map(function(datapoint,ix) {
      var start_x = (datapoint.lon-5) //5 comes from 360/num_x_bins(36)/2, can abstract later
      var start_y = (datapoint.lat+5)
      return(
        <MapRect
          width={gridSize_x}
          height={gridSize_y}
          x={start_x}
          y={start_y}
          fill="red"
          key={ix}
          />
      );
    });

    return (
      <g>
        <g> {rectangle} </g>
      </g>
    );
  }

});

export default MapDataSeries;
