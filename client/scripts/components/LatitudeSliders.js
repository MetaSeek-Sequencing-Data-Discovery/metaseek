import React, {Component} from 'react';
import Slider from 'material-ui/Slider';


 var LatitudeSliders = React.createClass({
   getInitialState : function() {
     return {
       "minSlider":-90,
       "maxSlider":90
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
        <p>
          <span>Latitude range is {this.state.minSlider} to {this.state.maxSlider} inclusive</span>
        </p>
        <Slider
          className="explore-filter-slider"
          min={-90}
          max={90}
          step={1}
          defaultValue={-90}
          value={this.state.minSlider}
          onChange={this.handleMinValue}
          onDragStop={this.handleDragStop.bind(this,"latitudeMin","latitude",4,this.state.minSlider)}
        />
        <Slider
          className="explore-filter-slider"
          min={-90}
          max={90}
          step={1}
          defaultValue={90}
          value={this.state.maxSlider}
          onChange={this.handleMaxValue}
          onDragStop={this.handleDragStop.bind(this,"latitudeMax","latitude",3,this.state.maxSlider)}
        />
      </div>
    );
  }
});

export default LatitudeSliders;
