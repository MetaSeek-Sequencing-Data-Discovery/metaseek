import React, {Component} from 'react';
import Slider from 'material-ui/Slider';


 var LatitudeSliders = React.createClass({
   getInitialState : function() {
     return {
       "minSlider":-90,
       "maxSlider":90
     }
   },

   handleMinSlider : function(event) {
     var value=this.state.minSlider;
     var type="latitude_min";
     var field="latitude";
     this.props.handleMinChange(type,field,value);
   },

   handleMaxSlider : function(event) {
     var value=this.state.maxSlider;
     var type="latitude_max";
     var field="latitude";
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
        <span>Latitude range is {this.state.minSlider} to {this.state.maxSlider} inclusive</span>
      </p>
      <div>
        <div>
          <Slider
            min={-90}
            max={90}
            step={0.5}
            defaultValue={-90}
            value={this.state.minSlider}
            onChange={this.handleMinValue}
            onDragStop={this.handleMinSlider}
          />
          <Slider
            min={-90}
            max={90}
            step={0.5}
            defaultValue={90}
            value={this.state.maxSlider}
            onChange={this.handleMaxValue}
            onDragStop={this.handleMaxSlider}
          />
        </div>
      </div>
      </div>
    );
  }
});

export default LatitudeSliders;
