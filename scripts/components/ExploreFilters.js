import React from 'react';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

var ExploreFilters = React.createClass({
  getInitialState : function() {
    return {
      'database':0,
      'env_package':0
    }
  },

  handleChange : function(type, event, index, value) {
    this.state[type] = value;
    this.setState(this.state);

    var rules = [];
    // This is janky as hell and won't scale beyond 3-4 without becoming a PITA
    if (this.state.database > 0) {
      var dbRule = {
        'field':'database',
        'type':4
      };
      if (this.state.database == 1) {
        dbRule.value = 'EBI';
      } else {
        dbRule.value = 'GenBank';
      }
      rules.push(dbRule);
    }

    if (this.state.env_package > 0) {
      var envRule = {
        'field':'env_package',
        'type':4
      };
      if (this.state.env_package == 1) {
        envRule.value = 'sediment';
      } else {
        envRule.value = 'soil';
      }
      rules.push(envRule);
    }

    this.props.applyRules(rules);
  },

  render : function() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h4>Choose Database</h4>
            <SelectField value={this.state.database} onChange={this.handleChange.bind(this,'database')}>
              <MenuItem value={0} primaryText="All" />
              <MenuItem value={1} primaryText="EBI" />
              <MenuItem value={2} primaryText="GenBank" />
            </SelectField>
            <h4>Choose Environment Package</h4>
            <SelectField value={this.state.env_package} onChange={this.handleChange.bind(this,'env_package')}>
              <MenuItem value={0} primaryText="All" />
              <MenuItem value={1} primaryText="sediment" />
              <MenuItem value={2} primaryText="soil" />
            </SelectField>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default ExploreFilters;
