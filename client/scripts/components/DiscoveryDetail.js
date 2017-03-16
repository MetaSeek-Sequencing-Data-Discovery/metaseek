import React from 'react';
import axios from 'axios';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';

// My component imports
import Header from './Header';

var apiRequest = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/'
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
      <MuiThemeProvider>
        <div>
          <Header history={this.props.history}/>
          <Paper zDepth={2}>
            <h2>Dataset Detail</h2>
                      {JSON.stringify(this.state.discovery)}
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
});

export default DiscoveryDetail;
