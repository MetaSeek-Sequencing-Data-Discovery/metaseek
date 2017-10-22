import React from 'react';
import Slider from 'rc-slider';

const Range = Slider.createSliderWithTooltip(Slider.Range);

var RangeSlider = React.createClass({
  getInitialState : function() {
    return {
      "minSlider":this.props.minValue,
      "maxSlider":this.props.maxValue
    }
  },

  handleValues : function(value) {
    this.setState({"minSlider": value[0]});
    this.setState({"maxSlider": value[1]});
  },

  handleStop : function(filterMin,filterMax,field,filterTypeMin,filterTypeMax,value) {
    this.props.handleFilterChange(filterMin, field, filterTypeMin, event, null, value.minSlider);
    this.props.handleFilterChange(filterMax, field, filterTypeMax, event, null, value.maxSlider);
  },



  render : function() {
    var {field, filterMin, filterMax, filterTypeMin, filterTypeMax, min, max, minValue, maxValue, handleFilterChange, ...other} = this.props;
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
        />
      </div>
    );
  }

});

export default RangeSlider;
