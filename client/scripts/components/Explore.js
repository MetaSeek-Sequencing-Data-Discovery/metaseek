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
import Loading from './Loading';


// Firebase setup
var firebaseEndpoint = 'https://metaseq-6b779.firebaseio.com/';
var base = Rebase.createClass(firebaseEndpoint);

var apiRequest = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/'
});

var Explore = React.createClass({
  getInitialState : function() {
    return {
      'fullData': [
    {
      "avg_percent_gc": 0.51,
      "avg_read_length": 0,
      "biosample_link": "\"https://www.ncbi.nlm.nih.gov/biosample/5560474\"",
      "download_size": 0,
      "env_package": "\"water\"",
      "investigation_type": "",
      "latitude": 44.8016,
      "library_source": "\"genomic\"",
      "longitude": -110.729,
      "sample_title": "\"Bacillus licheniformis ASZ2 isolated from Yellowstone National Park\"",
      "total_num_bases": 0,
      "total_num_reads": 0,
      "uri": "http://127.0.0.1:5000/api/dataset/1"
    },
    {
      "avg_percent_gc": 0.51,
      "avg_read_length": 0,
      "biosample_link": "\"https://www.ncbi.nlm.nih.gov/biosample/5560474\"",
      "download_size": 0,
      "env_package": "\"water\"",
      "investigation_type": "\"bacteria\"",
      "latitude": 44.8016,
      "library_source": "\"genomic\"",
      "longitude": -110.729,
      "sample_title": "\"Bacillus licheniformis ASZ2 isolated from Yellowstone National Park\"",
      "total_num_bases": 0,
      "total_num_reads": 0,
      "uri": "http://127.0.0.1:5000/api/dataset/2"
    }],
      'rules':[],
      'discoveryId':null,
      "summaryData":[],
      "loaded":false
    }
  },

  componentWillMount : function() {
    var self = this;
    apiRequest.get("/datasets/summary")
    .then(function (response) {
      self.setState({"summaryData": response.data.summary,
        "loaded":true
      });
    })
    this.state.activeData = this.state.fullData;
    this.setState({ 'activeData' : this.state.fullData});
  },
  componentWillUnmount : function() {
    base.removeBinding(this.ref);
  },

  applyRules : function(rules) {
    // I think this should be changed so that a SearchDatasetsSummary api call is made, updating the summaryData
    //if this.state.summaryData.totalDatasets < threshold, can send fullData
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
      //this.state.rules = rules;
      this.setState(this.state);
    }
    else {
      this.setState({ 'activeData' : this.state.fullData});
    }
  },

  addRule(rule,key) {
  //update our state
  const rules = {...this.state.rules}; //make copy existing state
  //add in our new rule
  rules[key] = rule;
  //set state
  this.setState({"rules": rules})
  },

  removeRule(key) {
  const rules = {...this.state.rules}; //make copy existing state
  rules[key] = null;
  //set state
  this.setState({"rules": rules})
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
    if (!this.state.loaded) return <Loading/>;
    console.log(this.state);
    return (
      <div>
        <Header history={this.props.history}/>
          <h2>Explore Data</h2>
          <MuiThemeProvider>
            <div>
              <Paper style={{'width':'80%','margin':'25px auto','padding':25}}>
                <ExploreFilters applyRules={this.applyRules} addRule={this.addRule} removeRule={this.removeRule} summaryData={this.state.summaryData}/>
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
                <ExploreSummaryStats summaryData={this.state.summaryData}/>
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
