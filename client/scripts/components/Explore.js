import React from 'react';
import axios from 'axios';

// Firebase imports / setup
import Rebase from 're-base';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

// My component imports
import Header from './Header';
import ExploreFilters from './ExploreFilters';
import ExploreTable from './ExploreTable';
import ExploreSummaryStats from './ExploreSummaryStats';

// Firebase setup
var firebaseEndpoint = 'https://metaseq-6b779.firebaseio.com/';
var base = Rebase.createClass(firebaseEndpoint);

var apiRequest = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/'
});

var Explore = React.createClass({
  getInitialState : function() {
    return {
      'fullData': [],
      'rules':[],
      'discoveryId':null
    }
  },

  componentWillMount : function() {
    var self = this;

    apiRequest.get('/datasets/summary')
    .then(function (response) {
      self.setState({"fullData": response.data.summary,});
    })
    //this.state.activeData = this.state.fullData;
    self.setState({ 'activeData' : this.state.fullData});
  },
  componentWillUnmount : function() {
    base.removeBinding(this.ref);
  },

  applyRules : function(rules) {
    if (rules) {
      var tableData = this.state.fullData;
      for (var i = 0;i < rules.length;i++) {
        // don't love this because it loops through every row once per rule (and we may have a lot!)
        tableData = tableData.filter(function(row) {
          if (row[rules[i].field] == rules[i].value) {
            return true;
          } else {
            return false;
          }
        });
      }
      this.state.activeData = tableData;
      this.state.rules = rules;
      this.setState(this.state);
    }
    else {
      this.setState({ 'activeData' : this.state.fullData});
    }
  },

  submitDiscovery : function() {
    var discoveryId = (new Date()).getTime();
    this.state.discoveryId = discoveryId;
    this.ref = base.syncState('/discovery/' + this.state.discoveryId, {
        context: this,
        state: 'rules'
    });
    this.setState(this.state);
  },

  openDiscovery : function() {
    this.props.history.push('/discovery/' + this.state.discoveryId);
  },

  render : function() {
    console.log(this.state);
    console.log(this.state.activeData.totalDatasets);
    return (
      <div>
        <Header history={this.props.history}/>
          <h2>Explore Data</h2>
          <MuiThemeProvider>
            <div>
              <Paper style={{'width':'80%','margin':'25px auto','padding':25}}>
                <ExploreFilters applyRules={this.applyRules}/>
                <RaisedButton
                  style={{'margin':'12px 12px 0 12px'}}
                  onClick={this.submitDiscovery}
                  primary={true}
                  label="Save Discovery"
                />
                <RaisedButton
                  style={{'margin':'12px 12px 0 12px'}}
                  onClick={this.openDiscovery}
                  primary={true}
                  disabled={this.state.discoveryId ? false : true}
                  label="Open Discovery"
                />
              </Paper>
              <Paper style={{'width':'80%','margin':'25px auto','padding':25}}>
                <ExploreSummaryStats activeData={this.state.activeData}/>
              </Paper>
              <Paper style={{'width':'80%','margin':'25px auto','padding':0}}>
                <ExploreTable activeData={this.state.activeData}/>
              </Paper>
            </div>
          </MuiThemeProvider>
      </div>
    )
  }
});

export default Explore;
