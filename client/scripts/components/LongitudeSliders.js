import React, {Component} from 'react';
import Slider from 'material-ui/Slider';


 var LongitudeSliders = React.createClass({
   getInitialState : function() {
     return {
       "minSlider":-180,
       "maxSlider":180
     }
   },

   handleMinSlider : function(event) {
     var value=this.state.minSlider;
     var type="longitude_min";
     var field="longitude";
     this.props.handleMinChange(type,field,value);
   },

   handleMaxSlider : function(event) {
     var value=this.state.maxSlider;
     var type="longitude_max";
     var field="longitude";
     this.props.handleMaxChange(type,field,value);
   },

   handleMinValue : function(event, value) {
     this.setState({"minSlider": value});
   },

   handleMaxValue : function(event, value) {
     this.setState({"maxSlider": value});
   },

  render : function() {
    return (
      <div>
      <p>
        <span>Longitude range is {this.state.minSlider} to {this.state.maxSlider} inclusive</span>
      </p>
        <Slider
          style={{height: 200}}
          axis="y"
          min={-180}
          max={180}
          step={0.5}
          defaultValue={-180}
          value={this.state.minSlider}
          onChange={this.handleMinValue}
          onDragStop={this.handleMinSlider}
        />
        <Slider
          style={{height: 200}}
          axis="y"
          min={-180}
          max={180}
          step={0.5}
          defaultValue={180}
          value={this.state.maxSlider}
          onChange={this.handleMaxValue}
          onDragStop={this.handleMaxSlider}
        />
      </div>
    );
  }
});

export default LongitudeSliders;
