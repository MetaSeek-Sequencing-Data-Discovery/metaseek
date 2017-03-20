import React from 'react';
import d3 from 'd3';
import MapRect from './MapRect';

const MapDataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    gridSize_x: React.PropTypes.number,
    gridSize_y: React.PropTypes.number,
    fill: React.PropTypes.string,
    chartwidth: React.PropTypes.number,
    chartheight: React.PropTypes.number,
    num_x_bins: React.PropTypes.number,
    num_y_bins: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      data: []
    };
  },

  render() {
    let {data, gridSize_x, gridSize_y, fill,chartwidth,chartheight,num_x_bins,num_y_bins} = this.props;

    var colorScale = d3.scale.linear()
  	.domain([0, d3.max(data, function(d) {return d.count; })])
  	.range(["#FFFFFF", "#151174"])

    let rectangle = data.map(function(datapoint,ix) {
      var start_x = ((datapoint.lon-(360/num_x_bins/2))*(chartwidth/360)+(chartwidth/2)) //5 comes from 360/num_x_bins(36)/2, can abstract later chartwidth/360=2
      var start_y = ((datapoint.lat-(180/num_y_bins/2))*(chartheight/180)+(chartheight/2))
      var rect_fill = colorScale(datapoint.count)
      return(
        <MapRect
          width={gridSize_x}
          height={gridSize_y}
          x={start_x}
          y={start_y}
          fill={rect_fill}
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
