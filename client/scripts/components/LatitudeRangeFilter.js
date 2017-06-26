import React from 'react';
import ReactDOM from 'react-dom';
import InputRange from 'react-input-range';

var LatFilter = React.createClass({
  getInitialState : function() {
    return {
      'latfilt_value':{ min: -90, max: 90 },
    }
  },

  render : function() {
    return (
      <InputRange
        maxValue={90}
        minValue={-90}
        value={this.state.latfilt_value}
        onChange={value => this.setState({ value })} />
    );
  }
});

export default LatFilter;
