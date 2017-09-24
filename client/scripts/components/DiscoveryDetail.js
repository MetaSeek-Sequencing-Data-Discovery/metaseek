import React from 'react';
import axios from 'axios';
import apiConfig from '../config/api.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';

// My component imports
import Header from './Header';
import VizDashboard from './VizDashboard';
import Loading from './Loading';

var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var DiscoveryDetail = React.createClass({
  getInitialState: function() {
    return {
      'discovery':{},
      'summaryData': [],
      'loaded': false
    }
  },
  componentWillMount: function() {
    var self = this;
    apiRequest.get('/discovery/' + this.props.params.id)
    .then(function (response) {
      self.setState({"discovery": response.data.discovery});
      apiRequest.post("/datasets/search/summary", {
        "filter_params":response.data.discovery.filter_params
      }).then(function (response) {
        self.setState({"summaryData": response.data.summary, "loaded":true})
      });
    });
  },
  render: function() {
    if (!this.state.loaded) return <Loading/>;

    return (
      <div>
        <Header history={this.props.history}/>
          <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
            <div className="explore-container">
              <Paper className="single-sheet card three" >
                <h2>{this.state.discovery.discovery_title}</h2>
                <h3>Discovery Details</h3>
                {JSON.stringify(this.state.discovery)}
              </Paper>
              <VizDashboard activeSummaryData={this.state.summaryData}/>
            </div>
          </MuiThemeProvider>
      </div>

    )
  }
});

export default DiscoveryDetail;
