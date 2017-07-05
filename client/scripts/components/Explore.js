import React from 'react';
import axios from 'axios';
import apiConfig from '../config/api.js';
import Firebase from 'firebase';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';

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
  baseURL: apiConfig.baseURL
});

var Explore = React.createClass({
  getInitialState : function() {
    return {
      'fullData': [],
      'activeData': [],
      'activeSummaryData': [],
      'summaryData':[],
      'histinput':'avg_read_length_summary',
      'filter_params':JSON.stringify({'rules':[]}),
      'loaded':false,
      'processing':false,
      'firebase':{
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
      this.state.firebase.photo = user.photoURL;
      this.setState({"firebase": this.state.firebase});
    }
    var self = this;
    apiRequest.get("/datasets/summary")
    .then(function (response) {
      self.setState({"fullSummaryData": response.data.summary,"activeSummaryData": response.data.summary});
    });
  },

  updateActiveSummaryData : function() {
    var self = this;
    self.setState({"processing":true});
    apiRequest.post("/datasets/search/summary", {
      "filter_params":self.state.filter_params
    }).then(function (response) {
      self.setState({"activeSummaryData": response.data.summary,"processing":false});
    });
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
    var self = this;
    self.state.firebase.name = user.displayName;
    self.state.firebase.uid = user.uid;
    self.state.firebase.photo = user.photoURL;
    apiRequest.post("/user/create", {
      "firebase_id":self.state.firebase.uid,
      "admin":0
    }).then(function(response){
      self.setState({"firebase": self.state.firebase});
    });
  },

  updateFilterParams : function(filterStates) {
    filterStates = Object.values(filterStates).filter(function(ruleObject){
      if (ruleObject.value == "All" || ruleObject.value=="") {
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
    apiRequest.post("/discovery/create", {
      "owner_id":self.state.firebase.uid,
      "filter_params":self.state.filter_params
    }).then(function (response) {
      self.props.history.push("/discovery/" + response.data.discovery.id);
    });
  },

  handleHistSelect : function(event,index,value) {
    this.setState({"histinput":value});
  },

  render : function() {
    if (!this.state.loaded) return <Loading/>;

    var mapRender = function(activeSummaryData,isProcessing) {
      if (!isProcessing) {
        if (activeSummaryData.empty) {
          return <h3>Sorry, no matches!</h3>
        } else {
          return <HeatmapChart data={activeSummaryData.latlon_map}/>
        }
      } else {
        return <div>
          <div>
            <div className='uil-rolling-css component-loader'>
              <div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
          <h3>Processing...</h3>
        </div>
      }
    };

    return (
      <div>
        <Header history={this.props.history}/>
          <h2>Explore</h2>
          <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
            <div className="explore-container">
              <Paper className="explore-filter-card">
                <div className="profile-container">
                  <span>
                    {this.state.firebase.uid ? "Hi, " + this.state.firebase.name + ". Thanks for using MetaSeek!" : "Create an account or log in to save a discovery to your account."}
                  </span>
                  <div className="profile-image-container">
                    <img className="profile-image" style={{'display':this.state.firebase.uid ? 'inline' : 'none'}} src={this.state.firebase.photo}/>
                  </div>
                  <RaisedButton
                    className="profile-button"
                    onClick={this.state.firebase.uid ? this.submitDiscovery : this.triggerGoogleLogin}
                    primary={true}
                    label={this.state.firebase.uid ? "Save Discovery" : "Log In With Google"}
                  />
                  <RaisedButton
                    className="profile-button"
                    label="Log Out"
                    onClick={this.triggerLogout}
                    primary={true}
                    disabled={!(this.state.firebase.uid)}
                  />
                </div>
                <ExploreFilters
                  className="explore-filters"
                  updateFilterParams={this.updateFilterParams}
                  activeSummaryData={this.state.activeSummaryData}
                />
              </Paper>
              <Paper className="explore-right-map">
                <div>
                  {mapRender(this.state.activeSummaryData,this.state.processing)}
                </div>
              </Paper>
              <Paper className="explore-right-summary">
                <div>
                  <ExploreSummaryStats activeSummaryData={this.state.activeSummaryData}/>
                </div>
              </Paper>
              <Paper className="explore-right-histogram">
                  <Histogram activeSummaryData={this.state.activeSummaryData} histinput={this.state.histinput}/>
                  <SelectField value={this.state.histinput} onChange={this.handleHistSelect}>
                    {Object.keys(this.state.activeSummaryData).filter(function(value) {
                      if (value.indexOf('summary') !== -1) {
                        return true;
                      } else {
                        return false;
                      }
                    }).map(function(value, index) {
                        return (
                          <MenuItem key={index} value={value} primaryText={value} />
                        )
                    })}
                  </SelectField>
              </Paper>
              <Paper className="explore-table">
                <ExploreTable activeData={this.state.activeData}/>
              </Paper>
            </div>
          </MuiThemeProvider>
      </div>
    )
  }
});

export default Explore;
