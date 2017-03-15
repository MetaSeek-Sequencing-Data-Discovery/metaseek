import React from 'react';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LatitudeSliders from './LatitudeSliders';
import LongitudeSliders from './LongitudeSliders';
import AvgReadLengthSlider from './AvgReadLengthSlider';

var ExploreFilters = React.createClass({
  getInitialState : function() {
    return {
      "env_package":0,
      "library_source":0,
      "investigation_type":0,
      "latitudeMin":0,
      "latitudeMax":0,
      "longitudeMin":0,
      "longitudeMax":0,
      "avgRdLgthMin":0,
      "avgRdLgthMax":0
    }
  },

  handleSelectChange : function(type, event, index, value) {
    this.state[type] = value;
    this.setState(this.state);

    var querytype = 8; //for a selectField, api query type will always be ==

    if (value=="All") {
      this.props.removeRule(type);
    } else {
      var dbRule = {
        "field":type,
        "type":querytype,
        "value":[value]
      }
      var key = dbRule["field"]
      this.props.addRule(dbRule,key);
    }

    //this.props.applyRules(this.props.rules);
  },


  handleMinChange : function(type, field, value) {
    this.state[type] = value;
    this.setState(this.state);

    var querytype = 4; //for a range minimum, api query type will always be >=

    var dbRule = {
      "field":field,
      "type":querytype,
      "value":[value]
    }
    var key = type
    this.props.addRule(dbRule,key);
    //this.props.applyRules(this.props.rules);
  },

  handleMaxChange : function(type, field, value) {
    this.state[type] = value;
    this.setState(this.state);

    var querytype = 3; //for a range maximum, api query type will always be <=

    var dbRule = {
      "field":field,
      "type":querytype,
      "value":[value]
    }
    var key = type
    this.props.addRule(dbRule,key);
    //this.props.applyRules(this.props.rules);
  },


  //define handleMinRangeChange and handleMaxRangeChange functions

  render : function() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h4>Library Source</h4>
            <SelectField value={this.state.library_source} onChange={this.handleSelectChange.bind(this,"library_source")}>
              <MenuItem value={"All"} primaryText="All" />
              {
                Object
                .keys(this.props.summaryData.library_source_summary)
                .map(key => <MenuItem key={key} value={key} primaryText={key} />)
              }
            </SelectField>

            <h4>Choose Environmental Package</h4>
            <SelectField value={this.state.env_package} onChange={this.handleSelectChange.bind(this,"env_package")}>
              <MenuItem value={"All"} primaryText="All" />
              {
                Object
                .keys(this.props.summaryData.env_package_summary)
                .map(key => <MenuItem key={key} value={key} primaryText={key} />)
              }
            </SelectField>

            <h4>Investigation Type</h4>
            <SelectField value={this.state.investigation_type} onChange={this.handleSelectChange.bind(this,"investigation_type")}>
              <MenuItem value={"All"} primaryText="All" />
              {
                Object
                .keys(this.props.summaryData.investigation_type_summary)
                .map(key => <MenuItem key={key} value={key} primaryText={key} />)
              }
            </SelectField>
            <h4>Latitude</h4>
            <LatitudeSliders handleMinChange={this.handleMinChange}
              handleMaxChange={this.handleMaxChange}
              latitudeMin={this.state.latitudeMin}
              latitudeMax={this.state.latitudeMax}
            />
          <h4>Longitude</h4>
            <LongitudeSliders handleMinChange={this.handleMinChange}
              handleMaxChange={this.handleMaxChange}
              latitudeMin={this.state.longitudeMin}
              latitudeMax={this.state.longitudeMax}
            />
          <h4>Enter an Average Read Length minimum and maximum</h4>
            <AvgReadLengthSlider handleMinChange={this.handleMinChange}
              handleMaxChange={this.handleMaxChange}
              avgRdLgthMin={this.state.avgRdLgthMin}
              avgRdLgthMax={this.state.avgRdLgthMax}
            />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default ExploreFilters;
