import React from 'react';

var MapLegend = React.createClass({
  getInitialState : function() {
    return {
      'alpha0': '0.25',
      'alpha1': '0.5',
      'alpha2': '0.75'
    }
  },

  render : function() {

    return (
      <svg width='100' height='500'>
        <rect x='0' y='0' width='50' height='50' fill='rgb(99,105,224)' opacity={this.state.alpha0} strokeWidth='1' stroke='rgba(0,0,0,255)' />
        <rect x='0' y='50' width='50' height='50' fill='rgb(99,105,224)' opacity={this.state.alpha1} strokeWidth='1' stroke='rgba(0,0,0,255)' />
        <rect x='0' y='100' width='50' height='50' fill='rgb(99,105,224)' opacity={this.state.alpha2} strokeWidth='1' stroke='rgba(0,0,0,255)' />
        <text x='50' y='5'>0</text>
        <text x='50' y='55'>10.0</text>
      </svg>
    );
  }
});

export default MapLegend;
