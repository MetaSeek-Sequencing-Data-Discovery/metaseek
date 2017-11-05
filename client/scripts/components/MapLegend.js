import React from 'react';

var MapLegend = React.createClass({
  getInitialState : function() {
    return {
      'fills': null,
      'countRanges': null
    }
  },

  renderRect : function(rgb, index) {
    return (
      <rect x='4' y={110+(30*index)} width='50' height='30' fill='rgb(66, 91, 161)' fillOpacity={rgb[3]/255} stroke='rgb(125,125,125)' strokeOpacity='1' key={index} />
    )
  },

  renderText : function(count, index) {
    return (
      <text x='59' y={(index*30)+115} stroke="none" fill='rgb(125,125,125)' fontFamily='Roboto' fontSize='14' key={index}>{count}</text>
    )
  },

  render : function() {
    const fills = this.props.fills;
    const ranges = this.props.ranges;
    return (
      <div className="map-legend">
        <svg width='100' height='500'>
          <text x='0' y='90' stroke='none' fill='rgb(125,125,125)' fontFamily='Roboto' fontSize='16'>Dataset Count</text>
          {fills.map(this.renderRect)};
          {ranges.map(this.renderText)};
        </svg>
      </div>
    );
  }
});

export default MapLegend;
