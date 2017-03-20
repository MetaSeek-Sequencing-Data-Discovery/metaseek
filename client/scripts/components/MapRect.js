import React from 'react';

const MapRect = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    stroke: React.PropTypes.string,
    strokeopacity: React.PropTypes.number,
    opacity: React.PropTypes.number,
    fill: React.PropTypes.string
  },

  getDefaultProps() {
    return{
      stroke: 'white',
      strokeopacity: 0.5,
      opacity: 0.7
    };
  },

  render() {
    let {width, height, x, y, stroke, strokeopacity, opacity, fill} = this.props;
    return(
      <rect
        width={width}
        height={height}
        x={x}
        y={y}
        stroke={stroke}
        strokeOpacity={strokeopacity}
        opacity={opacity}
        fill={fill}
      />

    );
  }

});

export default MapRect;
