import React from 'react';
import createFragment from 'react-addons-create-fragment'
import axios from 'axios';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

// My component imports
import Header from './Header';

var apiRequest = axios.create({
  baseURL: 'https://api.metaseek.cloud/api/'
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
      self.setState({"apiResponse": response.data})
    })
  },

  render : function() {
    var resultItems = <li>Hi!</li>;

    if (this.state.apiResponse.datasets) {
      var datasets = this.state.apiResponse.datasets;
      console.log(datasets);
      resultItems = datasets.map(function(dataset,index) {
        console.log(dataset);
        return <li key={index}>The latitude is {dataset.latitude}, and the longitude is {dataset.longitude}</li>
      });
    }
    return (
      <ul>{resultItems}</ul>
    )
  }
});

export default ApiTest;
