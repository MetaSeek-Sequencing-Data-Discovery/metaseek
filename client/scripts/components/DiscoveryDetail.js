import React from 'react';
import axios from 'axios';
import apiConfig from '../config/api.js';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ColorPalette from './ColorPalette';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';

// My component imports
import Header from './Header';

var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var DiscoveryDetail = React.createClass({
  getInitialState: function() {
    return {
      'discovery':{}
    }
  },
  componentWillMount: function() {
    var self = this;
    apiRequest.get('/discovery/' + this.props.params.id)
    .then(function (response) {
      self.setState({"discovery": response.data.discovery})
    })
  },
  renderRule : function(rule) {
    return (
      <li key={rule}>{rule}}</li>
    )
  },
  render: function() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
        <div>
          <Header history={this.props.history}/>
          <Paper zDepth={2}>
            <h2>Discovery Details</h2>
                      {JSON.stringify(this.state.discovery)}
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
});

export default DiscoveryDetail;
