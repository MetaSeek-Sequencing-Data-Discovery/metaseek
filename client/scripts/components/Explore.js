import React from 'react';
import axios from 'axios';
import Firebase from 'firebase';

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
import HeatmapChart from './HeatmapChart';

var apiRequest = axios.create({
  baseURL: 'https://api.metaseek.cloud/api/'
});

var Explore = React.createClass({
  getInitialState : function() {
    return {
      'fullData': [],
      'activeData': [],
      'activeSummaryData': [],
      "summaryData":[],
      "histinput":"avg_read_length_summary",
      "filter_params":"",
      "loaded":false,
      "firebase":{
        'uid':null,
        'name':null,
        'photo':null
      }
    }
  },

  componentWillMount : function() {
    var user = Firebase.auth().currentUser;
    if (user) {
      this.state.firebase.name = user.displayName;
      this.state.firebase.uid = user.uid;
      this.state.firebase.photo = user.photo;
      this.setState(this.state.firebase);
    }
    var self = this;
    apiRequest.get("/datasets/summary")
    .then(function (response) {
      // store the summary data response
      self.setState({"summaryData": response.data.summary});
      self.setState({"activeSummaryData": response.data.summary});

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

  updateActiveSummaryData : function() {
    //var self = this;
    //self.setState({"loaded":false});
    //apiRequest.post('/datasets/search/summary', {
    //  "filter_params":this.state.filter_params
    //}).then(function (response) {
    //  self.setState({"activeSummaryData": response.data.summary,"loaded":true});
    //});
  },

  triggerGoogleLogin : function() {
    var successfulLogin = this.successfulLogin;
    var provider = new Firebase.auth.GoogleAuthProvider();
    var auth = Firebase.auth().signInWithPopup(provider).then(function(result) {
      var user = result.user;
      successfulLogin(user);
    }).catch(function(error) {
      console.log("couldn't log in for some reason");
      console.log(error);
    });
  },

  triggerLogout : function() {
    var accountComponent = this;
    var auth = Firebase.auth().signOut().then(function() {
      accountComponent.state.firebase.name = null;
      accountComponent.state.firebase.uid = null;
      accountComponent.state.firebase.photo = null;
      accountComponent.setState(accountComponent.state.firebase);
    }, function(error) {
      console.log("couldn't log out for some reason");
      console.log(error);
    });
  },

  successfulLogin : function(user) {
    this.state.firebase.name = user.displayName;
    this.state.firebase.uid = user.uid;
    this.state.firebase.photo = user.photoURL;
    this.setState(this.state.firebase);
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
    this.updateActiveSummaryData();
  },

  submitDiscovery : function() {
    var self = this;
    apiRequest.post('/discovery/create', {
      "owner_id":this.state.firebase.uid,
      "filter_params":this.state.filter_params
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
                <div>
                <span>{this.state.firebase.uid ? "Hi, " + this.state.firebase.name + ". Thanks for using MetaSeek!" : "Create an account or log in to save a discovery to your account."}</span>
                  <div><img style={{'width':'150px','height':'150px','display':this.state.firebase.uid ? 'inline' : 'none'}} src={this.state.firebase.photo}/></div>
                </div>
                <RaisedButton
                style={{'margin':'12px 12px 0 12px'}}
                onClick={this.state.firebase.uid ? this.submitDiscovery : this.triggerGoogleLogin}
                primary={true}
                label={this.state.firebase.uid ? "Save Discovery" : "Log In With Google"}
                />
                <RaisedButton style={{'margin':'20px 20px 20px 20px'}}
                  label="Log Out"
                  onClick={this.triggerLogout}
                  primary={true}
                  disabled={!(this.state.firebase.uid)}
                />
                <ExploreFilters updateFilterParams={this.updateFilterParams}
                  summaryData={this.state.summaryData}
                  />
              </Paper>
              <Paper style={{'width':'80%','margin':'25px auto','padding':25}}>
                <ExploreSummaryStats summaryData={this.state.summaryData}/>
              </Paper>
              <Paper style={{'width':'80%','margin':'25px auto','padding':25}}>
                <HeatmapChart data={this.state.summaryData.latlon_map}/>
              </Paper>
              <Paper style={{'width':'60%','margin':'25px auto','padding':25}}>
                <Histogram summaryData={this.state.summaryData} histinput={this.state.histinput}/>
                  <SelectField value={this.state.histinput} onChange={this.handleHistSelect}>
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
