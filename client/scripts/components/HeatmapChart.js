import React from 'react';
import MapDataSeries from './MapDataSeries';

const HeatmapChart = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    num_y_bins: React.PropTypes.number,
    num_x_bins: React.PropTypes.number,
    data: React.PropTypes.array.isRequired
  },

  getDefaultProps() {
    return{
      chartwidth: 720,
      chartheight: 360,
      num_y_bins: 18,
      num_x_bins: 36
    }
  },

  render() {
    let {chartwidth, chartheight, num_y_bins, num_x_bins, data} = this.props;

    //set xScale and yScale (ordinal? linear? just append text at bottom?); calculate gridSize
    const gridSize_x = chartwidth/num_x_bins
    const gridSize_y = chartheight/num_y_bins

    return (
      <svg width={chartwidth} height={chartheight}>
        <MapDataSeries
          data={data}
          gridSize_x={gridSize_x}
          gridSize_y={gridSize_y}
        />
      </svg>
    );
  }

});

export default HeatmapChart;
