import React from 'react';
import axios from 'axios';
import apiConfig from '../config/api.js';
import Firebase from 'firebase';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ColorPalette from './ColorPalette';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
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
import Plotly from './Plotly';

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
    var self = this;
    self.setState({"processing":true});
    apiRequest.post('/datasets/search/summary', {
      "filter_params":this.state.filter_params
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
    apiRequest.post('/user/create', {
      "firebase_id":self.state.firebase.uid,
      "admin":0
    }).then(function(response){
      self.setState({"firebase": self.state.firebase});
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

    var mapRender = function(activeSummaryData,isProcessing) {
      if (!isProcessing) {
        if (activeSummaryData.empty) {
          return <h3 style={{textAlign:'center'}}>Sorry, no matches!</h3>
        } else {
          return <HeatmapChart data={activeSummaryData.latlon_map}/>
        }
      } else {
        return <div>
          <div style={{'margin':'25px auto 0'}}>
            <div className='uil-rolling-css' style={{'margin':'50px auto 0','transform':'scale(0.34)'}}>
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
          <h2 style={{fontSize:'2.6em',fontWeight:300}}>Explore</h2>
          <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
            <div style={{'width':1192,'margin':'0px auto','padding':10}}>
              <div style={{'height':780}}>
                <Paper style={{'height':860,'overflowY':'scroll','width':380,float:'left','margin':'0 0 0 0','padding':24}}>
                  <div style={{'margin':'12px auto'}}>
                    <span>{this.state.firebase.uid ? "Hi, " + this.state.firebase.name + ". Thanks for using MetaSeek!" : "Create an account or log in to save a discovery to your account."}</span>
                    <div><img style={{'width':'150px','height':'150px','display':this.state.firebase.uid ? 'inline' : 'none'}} src={this.state.firebase.photo}/></div>
                  </div>
                  <RaisedButton
                    style={{'margin':'12px 12px 0 12px'}}
                    onClick={this.state.firebase.uid ? this.submitDiscovery : this.triggerGoogleLogin}
                    primary={true}
                    label={this.state.firebase.uid ? "Save Discovery" : "Log In With Google"}
                  />
                  <RaisedButton
                    style={{'margin':'12px 12px 0 12px'}}
                    label="Log Out"
                    onClick={this.triggerLogout}
                    primary={true}
                    disabled={!(this.state.firebase.uid)}
                  />
                  <ExploreFilters
                    style={{'margin':'12px 12px 0 12px'}}
                    updateFilterParams={this.updateFilterParams}
                    summaryData={this.state.activeSummaryData}
                  />
                </Paper>
                <Paper style={{'float':'right','width':768,'height':408,'margin':'0 0 0 0','padding':24}}>
                  <div>
                    {mapRender(this.state.activeSummaryData,this.state.processing)}
                  </div>
                </Paper>
                <Paper style={{'float':'right','width':768,'margin':'15px 0 0 0'}}>
                  <div style={{'float':'left','width':300}}>
                    <ExploreSummaryStats summaryData={this.state.activeSummaryData}/>
                  </div>
                </Paper>
                <Paper style={{'float':'right','width':768,'height':320,'margin':'15px 0 0 0','padding':10}}>
                  <div style={{'float':'right','width':760,'padding':24}}>
                    <Histogram summaryData={this.state.activeSummaryData} histinput={this.state.histinput} style={{paddingLeft:'15px'}}/>
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
                  </div>
                </Paper>
              </div>
              <Paper style={{'width':'92%','margin':'24px auto','padding':0,'clear':'both'}}>
                <Plotly />
              </Paper>
              <Paper style={{'width':'92%','margin':'24px auto','padding':0,'clear':'both'}}>
                <ExploreTable activeData={this.state.activeData}/>
              </Paper>
            </div>
          </MuiThemeProvider>
      </div>
    )
  }
});

export default Explore;
