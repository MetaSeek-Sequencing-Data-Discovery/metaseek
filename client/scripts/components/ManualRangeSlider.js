import React from 'react';
import Slider from 'rc-slider';

const Range = Slider.createSliderWithTooltip(Slider.Range);

var ManualRangeSlider = React.createClass({
  getInitialState : function() {
    return {
      "minSlider":this.props.minValue,
      "maxSlider":this.props.maxValue
    }
  },

  handleValues : function(value) {
    this.setState({"minSlider": Number(value[0])});
    this.setState({"maxSlider": Number(value[1])});
  },

  handleStop : function(filterMin,filterMax,field,filterTypeMin,filterTypeMax,value) {
    if (value.minSlider==Object.keys(this.props.marks)[0]) {
      var mininput = "min";
    } else {
      var mininput = Number(Object.values(this.props.marks)[value.minSlider]);
    }
    this.props.handleNumericFilterChange(filterMin, field, filterTypeMin, event, null, Number(mininput));
    this.props.handleNumericFilterChange(filterMax, field, filterTypeMax, event, null, Number(Object.values(this.props.marks)[value.maxSlider]));
  },

  render : function() {
    var {field, filterMin, filterMax, filterTypeMin, filterTypeMax, min, max, minValue, maxValue, handleNumericFilterChange, marks, ...other} = this.props;
    return(
      <div className='range-slider'>
        <Range
          min={this.props.min}
          max={this.props.max}
          defaultValue={[this.props.minValue,this.props.maxValue]}
          value={[this.state.minSlider,this.state.maxSlider]}
          allowCross={false}
          onChange={this.handleValues}
          onAfterChange={this.handleStop.bind(this,this.props.filterMin,this.props.filterMax,this.props.field,this.props.filterTypeMin,this.props.filterTypeMax,this.state)}
          {...other}
          tipFormatter={value => Object.values(this.props.marks)[value]}
        />
      </div>
    );
  }

});

export default ManualRangeSlider;
