import React from 'react';
import createFragment from 'react-addons-create-fragment'
import axios from 'axios';

// Firebase imports / setup
import Rebase from 're-base';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

// My component imports
import Header from './Header';

var apiRequest = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/'
});

var ApiTest = React.createClass({
  getInitialState : function() {
    return {
      "apiResponse":{}
    }
  },

  componentWillMount: function() {
    var self = this;
    apiRequest.get('/datasets')
    .then(function (response) {
      self.setState({"apiResponse": response.data});
    })
  },

  render : function() {
    var resultItems = <li>no data yet</li>;

    if (this.state.apiResponse.datasets) {
      var datasets = this.state.apiResponse.datasets;
      resultItems = datasets.map(function(dataset,index) {
        return <li key={index}>{dataset.URL}</li>
      });
    }
    return (
      <ul>{resultItems}</ul>
    )
  }
});

export default ApiTest;
