import React, {Component} from 'react';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

 var AverageReadLengthInputs = React.createClass({
   getInitialState : function() {
     return {
       "minValue":'',
       "maxValue":''
     }
   },

   handleSubmit : function(filterName, field, filterType, fieldValue, event) {
     this.props.handleFilterChange(filterName, field, filterType, event, null, fieldValue);
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
            hintText="Average read length min."
            value={this.state.minValue}
            onChange={this.handleMinValue}
          />
          <RaisedButton secondary={true} labelStyle={{'fontSize':'11px'}}
            label="submit min"
            onTouchTap={this.handleSubmit.bind(this,"avgRdLgthMin","avg_read_length",4,this.state.minValue)}/>
          <TextField
            hintText="Average read length min."
            value={this.state.maxValue}
            onChange={this.handleMaxValue}
          />
          <RaisedButton secondary={true} labelStyle={{'fontSize':'11px'}}
          label="submit max"
          onTouchTap={this.handleSubmit.bind(this,"avgRdLgthMax","avg_read_length",3,this.state.maxValue)}/>
        </div>
      </div>
    );
  }
});

export default AverageReadLengthInputs;
