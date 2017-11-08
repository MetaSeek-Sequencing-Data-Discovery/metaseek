import React from 'react';
import Slider from 'rc-slider';

const Range = Slider.createSliderWithTooltip(Slider.Range);

var RangeSlider = React.createClass({
  getInitialState : function() {
    return {}
  },

  handleValues : function(value) {
    this.props.updateRangeValues(this.props.filterMin, this.props.filterMax, value[0], value[1]);
  },

  handleStop : function(filterMin,filterMax,field,filterTypeMin,filterTypeMax, min, max, minValue, maxValue) {
    this.props.handleNumericFilterChange(filterMin, field, filterTypeMin, min, event, null, minValue);
    this.props.handleNumericFilterChange(filterMax, field, filterTypeMax, max, event, null, maxValue);
  },

  render : function() {
    var {field, filterMin, filterMax, filterTypeMin, filterTypeMax, min, max, minValue, maxValue, handleFilterChange, ...other} = this.props;
    return(
      <div className='range-slider'>
        <Range
          min={this.props.min}
          max={this.props.max}
          defaultValue={[this.props.minValue,this.props.maxValue]}
          value={[this.props.minValue,this.props.maxValue]}
          allowCross={false}
          onChange={this.handleValues}
          onAfterChange={this.handleStop.bind(this,this.props.filterMin,this.props.filterMax,this.props.field,this.props.filterTypeMin,this.props.filterTypeMax, this.props.min, this.props.max, this.props.minValue, this.props.maxValue)}
          {...other}
        />
      </div>
    );
  }

});

export default RangeSlider;
