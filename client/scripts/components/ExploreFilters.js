import React from 'react';
import LatFilter from './LatitudeFilter';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

var ExploreFilters = React.createClass({
  getInitialState : function() {
    return {
      'database':0,
      'env_package':0,
      'library_source':0
    }
  },

  handleSelectChange : function(type, event, index, value) {
    this.state[type] = value;
    this.setState(this.state);

    var querytype = 0; //for a selectField, api query type will be ==

    if (value=="All") {
      this.props.removeRule(type);
    } else {
      var dbRule = {
        "field":type,
        "type":querytype,
        "value":value
      }
      var key = dbRule["field"]
      console.log('key',key)
      this.props.addRule(dbRule,key);
    }

    //this.props.applyRules(rules);
  },

  render : function() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h4>Library Source</h4>
            <SelectField value={this.state.library_source} onChange={this.handleSelectChange.bind(this,'library_source')}>
              <MenuItem value={"All"} primaryText="All" />
              <MenuItem value={"GENOMIC"} primaryText="Genomic" />
              <MenuItem value={"METAGENOMIC"} primaryText="Metagenomic" />
              <MenuItem value={"TRANSCRIPTOMIC"} primaryText="Transcriptomic" />
              <MenuItem value={"METATRANSCRIPTOMIC"} primaryText="Metatranscriptomic" />
              <MenuItem value={"SYNTHETIC"} primaryText="Synthetic" />
              <MenuItem value={"VIRAL RNA"} primaryText="Viral RNA" />
              <MenuItem value={"OTHER"} primaryText="Other" />
            </SelectField>

            <h4>Choose Database</h4>
            <SelectField value={this.state.database} onChange={this.handleSelectChange.bind(this,'database')}>
              <MenuItem value={"All"} primaryText="All" />
              <MenuItem value={"EBI"} primaryText="EBI" />
              <MenuItem value={"Genbank"} primaryText="GenBank" />
            </SelectField>
            <h4>Choose Environment Package</h4>
            <SelectField value={this.state.env_package} onChange={this.handleSelectChange.bind(this,'env_package')}>
              <MenuItem value={"All"} primaryText="All" />
              <MenuItem value={"sediment"} primaryText="sediment" />
              <MenuItem value={"soil"} primaryText="soil" />
            </SelectField>
            //<h4> Latitude </h4>
            //<LatFilter/>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default ExploreFilters;
