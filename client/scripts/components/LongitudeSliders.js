import React, {Component} from 'react';
import Slider from 'material-ui/Slider';


 var LongitudeSliders = React.createClass({
   getInitialState : function() {
     return {
       "minSlider":-180,
       "maxSlider":180
     }
   },

   handleMinValue : function(event, value) {
     this.setState({"minSlider": value});
   },

   handleMaxValue : function(event, value) {
     this.setState({"maxSlider": value});
   },

   handleDragStop : function(filterName, field, filterType, dragValue) {
     this.props.handleFilterChange(filterName, field, filterType, event, null, dragValue);
   },

  render : function() {
    return (
      <div>
        <p style={{padding:0}}>
          <span>Longitude range is {this.state.minSlider} to {this.state.maxSlider} inclusive</span>
        </p>
        <Slider
          style={{height:6, marginTop:-6}}
          min={-180}
          max={180}
          step={1}
          defaultValue={-180}
          value={this.state.minSlider}
          onChange={this.handleMinValue}
          onDragStop={this.handleDragStop.bind(this,"longitudeMin","longitude",4,this.state.minSlider)}
        />
        <Slider
          style={{height:6, marginTop:-6}}
          min={-180}
          max={180}
          step={1}
          defaultValue={180}
          value={this.state.maxSlider}
          onChange={this.handleMaxValue}
          onDragStop={this.handleDragStop.bind(this,"longitudeMax","longitude",3,this.state.maxSlider)}
        />
      </div>
    );
  }
});

export default LongitudeSliders;
