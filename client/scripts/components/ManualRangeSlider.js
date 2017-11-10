import React from 'react';
import Slider from 'rc-slider';

const Range = Slider.createSliderWithTooltip(Slider.Range);

var ManualRangeSlider = React.createClass({
  getInitialState : function() {
    return {
    }
  },

  handleValues : function(value) {
    this.props.updateRangeValues(this.props.filterMin, this.props.filterMax, value[0], value[1]);
  },

  handleStop : function(filterMin,filterMax,field,filterTypeMin,filterTypeMax, min, max, minValue, maxValue) {
    this.props.handleNumericFilterChange(filterMin, field, filterTypeMin, this.props.marks[min], event, null, this.props.marks[minValue]);
    this.props.handleNumericFilterChange(filterMax, field, filterTypeMax, this.props.marks[max], event, null, this.props.marks[maxValue]);
  },

  render : function() {
    var {field, filterMin, filterMax, filterTypeMin, filterTypeMax, min, max, minValue, maxValue, handleNumericFilterChange, marks, ...other} = this.props;
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
          tipFormatter={value => Object.values(this.props.marks)[value]}
        />
      </div>
    );
  }

});

export default ManualRangeSlider;
