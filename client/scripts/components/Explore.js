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
import Loading from './Loading';
import HeatmapChart from './HeatmapChart';
import HistogramVictory from './HistogramVictory';
import AreaChart from './AreaChart';
import WordCloud from './WordCloud';
import RadarChart from './RadarChart';
import MapDeckGL from './MapDeckGL';
import MapLegend from './MapLegend';
import {getReadableFileSizeString} from '../helpers';

var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var Explore = React.createClass({
  getInitialState : function() {
    return {
      'fullSummaryData':[],
      'activeSummaryData': [],
      'dataTable': {},
      'histinput':'investigation_type_summary',
      'areainput':'library_reads_sequenced_summary',
      'radarinput':'library_source_summary',
      'wordinput':'env_biome_summary',
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
      apiRequest.post("/datasets/search/1", {
        "filter_params":self.state.filter_params,
      }).then(function (response) {
        self.setState({"dataTable":response.data,"loaded":true});
      })
    });
  },

  updateActiveSummaryData : function() {
    var self = this;
    self.setState({"processing":true});
    apiRequest.post("/datasets/search/summary", {
      "filter_params":self.state.filter_params
    }).then(function (response) {
      self.setState({"activeSummaryData": response.data.summary});
      apiRequest.post("/datasets/search/1", {
        "filter_params":self.state.filter_params
      }).then(function (response) {
        self.setState({"dataTable":response.data,"processing":false});
      });
    });
  },

  getPreviousDataPage : function() {
    var self = this;
    apiRequest.post(self.state.dataTable.previousUri, {
      "filter_params":self.state.filter_params
    }).then(function (response) {
      self.setState({"dataTable":response.data});
    });
  },

  getNextDataPage : function() {
    var self = this;
    apiRequest.post(self.state.dataTable.nextUri, {
      "filter_params":self.state.filter_params
    }).then(function (response) {
      self.setState({"dataTable":response.data});
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
      if (ruleObject.value == "All" || ruleObject.value=="" || ruleObject.value=="[]") {
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

  handleAreaSelect : function(event,index,value) {
    this.setState({"areainput":value});
  },

  handleRadarSelect : function(event,index,value) {
    this.setState({"radarinput":value});
  },

  handleWordSelect : function(event,index,value) {
    this.setState({"wordinput":value});
  },

  render : function() {
    if (!this.state.loaded) return <Loading/>;

    const radarfields = ['study_type_summary','library_source_summary','investigation_type_summary','env_package_summary'];
    const wordfields = ['env_biome_summary','env_feature_summary','env_material_summary','geo_loc_name_summary'];
    const areafields = ['avg_read_length_summary', 'download_size_summary', 'gc_percent_summary', 'latitude_summary', 'longitude_summary', 'library_reads_sequenced_summary', 'total_bases_summary'];
    const histfields = ['sequencing_method_summary', 'instrument_model_summary', 'library_strategy_summary', 'library_screening_strategy_summary', 'library_construction_method_summary', 'investigation_type_summary', 'env_package_summary', 'library_source_summary', 'study_type_summary']

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
              <Paper className="explore-filters card left one">
                <ExploreFilters
                  className="explore-filter"
                  updateFilterParams={this.updateFilterParams}
                  activeSummaryData={this.state.activeSummaryData}
                  fullSummaryData={this.state.fullSummaryData}
                />
              </Paper>
              <Paper className="explore-headline card right two">
                <div className="profile-container">
                  <span className="welcome-message">
                    {this.state.firebase.uid ? "Hi, " + this.state.firebase.name + ". Thanks for using MetaSeek!" : "Create an account or log in with Google to save your discoveries."}
                  </span>
                  {//<div className="profile-image-container">
                    //<img className="profile-image" style={{'display':this.state.firebase.uid ? 'inline' : 'none'}} src={this.state.firebase.photo}/>
                  //</div>
                  }
                  <br/>
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
                <span className="callout"><span className="active">{this.state.activeSummaryData.total_datasets} datasets</span> out of <br/>{this.state.fullSummaryData.total_datasets} total datasets</span>
              </Paper>
              <Paper className="explore-map card right four">
                <div>
                  <MapDeckGL className="explore-map-render" mapdata={this.state.activeSummaryData.latlon_map}/>
                  <MapLegend fills={this.state.activeSummaryData.map_legend_info.fills} ranges={this.state.activeSummaryData.map_legend_info.ranges}/>
                </div>
              </Paper>
              <Paper className="explore-histogram card right one">
                <div className="explore-select">
                  <SelectField value={this.state.histinput} onChange={this.handleHistSelect}>
                    {Object.keys(this.state.activeSummaryData).filter(function(value) {
                      if (value.indexOf('summary') !== -1 && histfields.includes(value)) {
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
                <HistogramVictory activeSummaryData={this.state.activeSummaryData} histinput={this.state.histinput}/>
              </Paper>
              <Paper className="explore-wordcloud card right one">
                <div className="explore-select">
                  <SelectField value={this.state.wordinput} onChange={this.handleWordSelect}>
                    {Object.keys(this.state.activeSummaryData).filter(function(value) {
                      if (value.indexOf('summary') !== -1 && wordfields.includes(value)) {
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
                <WordCloud activeSummaryData={this.state.activeSummaryData} wordinput={this.state.wordinput}/>
              </Paper>
              <Paper className="explore-radarchart card right one">
                <div className="explore-select">
                  <SelectField value={this.state.radarinput} onChange={this.handleRadarSelect}>
                    {Object.keys(this.state.activeSummaryData).filter(function(value) {
                      if (value.indexOf('summary') !== -1 && radarfields.includes(value)) {
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
                <RadarChart activeSummaryData={this.state.activeSummaryData} radarinput={this.state.radarinput}/>
              </Paper>
              <Paper className="explore-areachart card right one">
                <div className="explore-select">
                  <SelectField value={this.state.areainput} onChange={this.handleAreaSelect}>
                    {Object.keys(this.state.activeSummaryData).filter(function(value) {
                      if (value.indexOf('summary') !== -1 && areafields.includes(value)) {
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
                <AreaChart activeSummaryData={this.state.activeSummaryData} areainput={this.state.areainput}/>
              </Paper>
              <Paper className="explore-download card right two">
                <span className="download-info">{getReadableFileSizeString(this.state.activeSummaryData.total_download_size)} <span className="download-info-tag">estimated download size</span></span>
                <RaisedButton
                  className="download-button"
                  primary={true}
                  label="Download datasets"
                />
              </Paper>
              <Paper className="explore-table card three">
                <ExploreTable getNextDataPage={this.getNextDataPage} getPreviousDataPage={this.getPreviousDataPage} dataTable={this.state.dataTable}/>
              </Paper>
            </div>
          </MuiThemeProvider>
      </div>
    )
  }
});

export default Explore;
