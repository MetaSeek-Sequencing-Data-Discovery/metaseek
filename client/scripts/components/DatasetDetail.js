import React from 'react';
import axios from 'axios';
import apiConfig from '../config/api.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';

// My component imports
import Header from './Header';

var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var DatasetDetail = React.createClass({
  getInitialState: function() {
      return {
        'dataset':{}
      }
  },
  componentWillMount: function() {
    var self = this;
    apiRequest.get('/dataset/' + this.props.params.id)
    .then(function (response) {
      self.setState({"dataset": response.data.dataset})
    })
  },
  renderField : function(field, index) {
    return (
      <ListItem key={index}>{field} - {this.state.dataset[field]}</ListItem>
    )
  },
  render: function() {
    return (
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div>
            <Header history={this.props.history}/>
            <Paper className="singleSheet" zDepth={2}>
              <h2>Dataset Detail</h2>
                <List>
                  {Object.keys(this.state.dataset).map(this.renderField)}
                </List>
            </Paper>
            <div style={{
              width: '75%',
              maxWidth: 800,
              height: 300,
              margin: '15px auto',
              display: 'flex'
            }}>
              <Paper style={{
                padding: 30,
                width: '48%',
                height: 300,
                margin: 'auto'
              }} zDepth={2}>
                <h2>Rollup Info</h2>
                <p>Maybe a chart goes here or something?</p>
              </Paper>
              <Paper style={{
                padding: 30,
                width: '48%',
                height: 300,
                margin: 'auto'
              }} zDepth={2}>
                <h2>More Rollup Info</h2>
                <p>Maybe a chart goes here or something?</p>
              </Paper>
            </div>
          </div>
        </MuiThemeProvider>
    )
  }
});

export default DatasetDetail;
