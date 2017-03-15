import React, {Component} from 'react';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

 var AvgReadLengthSlider = React.createClass({
   getInitialState : function() {
     return {
       "minValue":'',
       "maxValue":''
     }
   },

   handleMinRange : function(event, value) {
     var value=this.state.minValue;
     var type="avgrdlgth_min";
     var field="avg_read_length";
     this.props.handleMinChange(type,field,value);
   },

   handleMaxRange : function(event, value) {
     var value=this.state.maxValue;
     var type="avgrdlgth_max";
     var field="avg_read_length";
     this.props.handleMaxChange(type,field,value);
   },

   handleMinValue : function(event, value) {
     this.setState({"minValue": value});
   },

   handleMaxValue : function(event, value) {
     this.setState({"maxValue": value});
   },


  render : function() {
    return (
      <div>
        <div>
          <TextField
            hintText="enter a number"
            value={this.state.minValue}
            onChange={this.handleMinValue}
            style={{'width':'20%'}}
          />
          <RaisedButton secondary={true} labelStyle={{'fontSize':'11px'}}
          label="submit min"
          onTouchTap={this.handleMinRange}/>
          <span>- - - -     Average Read Length     - - - -</span>
          <TextField
            hintText="enter a number"
            value={this.state.maxValue}
            onChange={this.handleMaxValue}
            style={{'width':'20%'}}
          />
          <RaisedButton secondary={true} labelStyle={{'fontSize':'11px'}}
          label="submit max"
          onTouchTap={this.handleMaxRange}/>
        </div>
      </div>
    );
  }
});

export default AvgReadLengthSlider;
