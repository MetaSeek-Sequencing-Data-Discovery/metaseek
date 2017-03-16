import React from 'react';
import axios from 'axios';

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
import Histogram from './Histogram';

var apiRequest = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/'
});

var Explore = React.createClass({
  getInitialState : function() {
    return {
      'fullData': [],
      'activeData': [],
      "summaryData":[],
      "loaded":false,
      "histinput":"avg_read_length_summary",
      "filter_params":"",
      "loaded":false
    }
  },

  componentWillMount : function() {
    var self = this;
    apiRequest.get("/datasets/summary")
    .then(function (response) {
      // store the summary data response
      self.setState({"summaryData": response.data.summary,"loaded":true});

      // if there aren't too many datasets, just get 'em all
      if (response.data.summary.totalDatasets < 1000) {
        apiRequest.get("/datasets")
        .then(function (response) {
          // store the full response and set loaded to true
          self.setState({"fullData": response.data.datasets,"activeData" : response.data.datasets,"loaded":true});
          self.state.activeData = self.state.fullData;
          self.setState({ });
        })
      } else {
        self.setState({"loaded":true});
      }
    });
  },

  updateFilterParams : function(filterStates) {
    filterStates = Object.values(filterStates).filter(function(ruleObject){
      if (ruleObject.value == "All") {
        return false;
      }
      if (("field" in ruleObject) && ("value" in ruleObject) && ("type" in ruleObject)) {
        return true;
      } else {
        return false;
      }
    });
    this.state.filter_params = JSON.stringify({"rules":filterStates});
    this.setState({"filter_params":JSON.stringify({"rules":filterStates})});
  },

  submitDiscovery : function() {
    var self = this;
    /* This is a valid object to pass to the backend:
    {
    	"filter_params": {"rules":[{"field":"biosample_link","type":7,"value":"google"}]}
    }
    */
    var ruleObject = {"rules":[{"field":"biosample_link","type":7,"value":"google"}]};
    apiRequest.post('/discovery/create', {
      "owner_id":2,
      "filter_params":JSON.stringify(ruleObject)
    }).then(function (response) {
      self.props.history.push('/discovery/' + response.data.discovery.id);
    });
  },

  handleHistSelect : function(event,index,value) {
    this.setState({"histinput":value})
  },

  render : function() {
    if (!this.state.loaded) return <Loading/>;
    return (
      <div>
        <Header history={this.props.history}/>
          <h2>Explore Data</h2>
          <MuiThemeProvider>
            <div style={{display:'flex'}}>
              <Paper style={{'width':'80%','margin':'25px auto','padding':25}}>
                <RaisedButton
                style={{'margin':'12px 12px 0 12px'}}
                onClick={this.submitDiscovery}
                primary={true}
                label="Save Discovery"
                />
                <ExploreFilters updateFilterParams={this.updateFilterParams}
                  summaryData={this.state.summaryData}
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
