import React from 'react';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ColorPalette from './ColorPalette';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LatitudeSliders from './LatitudeSliders';
import LongitudeSliders from './LongitudeSliders';
import AverageReadLengthInputs from './AverageReadLengthInputs';

var ExploreFilters = React.createClass({
  getInitialState : function() {
    return {
      "filterStates": {
        "env_package":{
          "value":"All"
        },
        "library_source":{
          "value":"All"
        },
        "investigation_type":{
          "value":"All"
        },
        "latitudeMin":{
          "value":-90
        },
        "latitudeMax":{
          "value":90
        },
        "longitudeMin":{
          "value":-180
        },
        "longitudeMax":{
          "value":180
        },
        "avgRdLgthMin":{
          "value":0
        },
        "avgRdLgthMax":{
          "value":0
        }
    }
  }
},

  handleFilterChange : function(filterName, field, filterType, event, index, value) {
    var newRule = {
      "field":field,
      "type":filterType,
      "value":value
    };
    this.state.filterStates[filterName] = newRule;
    this.setState(this.state);
    this.props.updateFilterParams(this.state.filterStates);
  },

  renderMenuItem : function(value, index) {
    return (
      <MenuItem key={index} value={value} primaryText={value} />
    )
  },

  render : function() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div>
            {/* Ok, so...let's explain this change handler:
              onChange={this.handleFilterChange.bind(this,"library_source","library_source",5)}
              Javascript functions called in an event handler like this are often
              called with the simpler onChange={this.handleFilterChange}
              This will call the function with the standard arguments and scope
              using bind allows us to call it in the same scope (by saying ".bind(this")
              but then pass in additional arguments indicating the field and the filter type:
              "library_source","library_source",5
              These arguments are passed in first, prior to the standard function params.
               */}
             <h4>Library Source</h4>
            <SelectField value={this.state.filterStates.library_source.value} onChange={this.handleFilterChange.bind(this,"library_source","library_source",5)}>
              <MenuItem value={"All"} primaryText="All" />
              {Object.keys(this.props.summaryData.library_source_summary)
                     .map(this.renderMenuItem)}
            </SelectField>

            <h4>Choose Environmental Package</h4>
            <SelectField value={this.state.filterStates.env_package.value} onChange={this.handleFilterChange.bind(this,"env_package","env_package",5)}>
              <MenuItem value={"All"} primaryText="All" />
              {Object.keys(this.props.summaryData.env_package_summary)
                     .map(this.renderMenuItem)}
            </SelectField>

            <h4>Investigation Type</h4>
            <SelectField value={this.state.filterStates.investigation_type.value} onChange={this.handleFilterChange.bind(this,"investigation_type","investigation_type",5)}>
              <MenuItem value={"All"} primaryText="All" />
              {Object.keys(this.props.summaryData.investigation_type_summary)
                     .map(this.renderMenuItem)}
            </SelectField>
            <LatitudeSliders handleFilterChange={this.handleFilterChange}
              minValue={this.state.filterStates.latitudeMin.value}
              maxValue={this.state.filterStates.latitudeMax.value}
            />
            <LongitudeSliders style={{marginTop:12}} handleFilterChange={this.handleFilterChange}
              minValue={this.state.filterStates.longitudeMin.value}
              maxValue={this.state.filterStates.longitudeMax.value}
            />
            <AverageReadLengthInputs style={{marginTop:24}} handleFilterChange={this.handleFilterChange}
              minValue={this.state.filterStates.avgRdLgthMin.value}
              maxValue={this.state.filterStates.avgRdLgthMax.value}
            />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default ExploreFilters;
