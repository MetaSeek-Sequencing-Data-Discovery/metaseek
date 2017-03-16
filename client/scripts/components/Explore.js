import React from 'react';
import axios from 'axios';

// Firebase imports / setup
import Rebase from 're-base';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// My component imports
import Header from './Header';
import ExploreFilters from './ExploreFilters';
import ExploreTable from './ExploreTable';
import ExploreSummaryStats from './ExploreSummaryStats';
import Loading from './Loading';
import Histogramrd3 from './Histogramrd3';


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
      'discoveryId':null,
      "summaryData":[],
      "loaded":false,
      "histinput":"avg_read_length_summary"
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
  const rules = {...this.state.rules}; //make copy existing state
  //add in our new rule; append "value" field as array oldarray.concat(newarray); (might mess up e.g. ranges where don't want mult; maybe separate AddMultRule and AddSingleRule fns)
  rules[key] = rule;
  //set state
  this.setState({"rules": rules});
  //update summaryData state according to rules; call SearchDatasetSummary
  //var self = this;
  //apiRequest.post("/datasets/search/summary", [this.state.rules])
  //.then(function (response) {
  //  console.log(response);
  //  self.setState({"summaryData": response.data.summary});
  //});
  },

  removeRule(key) {
  const rules = {...this.state.rules}; //make copy existing state
  rules[key] = null;
  //set state
  this.setState({"rules": rules})
  //update summaryData state according to rules; call SearchDatasetSummary
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

  handleHistSelect : function(event,index,value) {
    this.setState({"histinput":value})
  },

  render : function() {
    if (!this.state.loaded) return <Loading/>;
    console.log(this.state.rules);
    console.log(this.state.summaryData[this.state.histinput])
    return (
      <div>
        <Header history={this.props.history}/>
          <h2>Explore Data</h2>
          <MuiThemeProvider>
            <div style={{distplay:'flex'}}>
              <Paper style={{'width':'80%','margin':'25px auto','padding':25}}>
                <ExploreFilters applyRules={this.applyRules}
                  addRule={this.addRule}
                  removeRule={this.removeRule}
                  summaryData={this.state.summaryData}
                  rules={this.state.rules}
                  />
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
              <Paper style={{'width':'60%','margin':'25px auto','padding':25}}>
                <Histogramrd3 summaryData={this.state.summaryData} histinput={this.state.histinput}/>
                  <SelectField value={this.state.histinput} onChange={this.handleHistSelect.bind(this)}>
                    {
                      Object
                      .keys(this.state.summaryData)
                      .map(key => <MenuItem key={key} value={key} primaryText={key} />)
                    }
                  </SelectField>
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
