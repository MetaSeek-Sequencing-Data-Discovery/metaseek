import React from 'react';
import * as firebase from "firebase";
import firebaseConfig from '../config/firebase.js';
firebase.initializeApp(firebaseConfig);

import axios from 'axios';
import apiConfig from '../config/api.js';

import { Link } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import Formsy from 'formsy-react';
import {FormsyText} from 'formsy-material-ui/lib';

import Header from './Header';

var db = firebase.database();
var signupRef = db.ref("signups");
var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var Welcome = React.createClass({
  getInitialState : function() {
    return {
      canSubmit:false,
      submitted:false,
      firebase:{
        uid:null,
        admin:0
      }
    }
  },

  componentWillMount: function() {
    var user = firebase.auth().currentUser;
    if (user) {
      this.state.firebase.uid = user.uid;
      var self = this;
      apiRequest.post('/user/create', {
        "firebase_id":self.state.firebase.uid,
        "admin":0
      }).then(function(response){
        console.log(response.data.uri);
        apiRequest.get(response.data.uri).then(function(response){
          if (response.data.user.admin) {
            self.state.firebase.admin = 1;
          }
          self.setState({"firebase": self.state.firebase});
        });
      });
    }
  },

  enableButton: function() {
    this.setState({
      canSubmit: true,
    });
  },

  disableButton : function() {
    this.setState({
      canSubmit: false,
    });
  },

  submitEmail : function(entry) {
    var newSignupRef = signupRef.push();

    var newSignup = entry;
    newSignupRef.set(newSignup);
    this.setState({
      submitted: true,
    });
  },

  render : function() {
    var errorMessages = {
      emailError: "Please provide a valid email address"
    };

    var exploreButtonDisplay = 'none';
    if (this.state.firebase.admin) {
      exploreButtonDisplay = 'flex';
    }

    return(
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div className="welcome-container">
            <h1>Welcome to MetaSeek</h1>
            <p>Discover, curate, and get access to thousands of sequencing samples from all over the web.</p>
              <div style={{'display':exploreButtonDisplay}}>
                <Paper zDepth={1}>
                  <Link to='/explore'>
                    <FlatButton label="DISCOVER"></FlatButton>
                  </Link>
                </Paper>
                <Paper zDepth={1}>
                  <Link to='/dataset/new'>
                    <FlatButton label="CONTRIBUTE"></FlatButton>
                  </Link>
                </Paper>
              </div>
              <h1>What is MetaSeek?</h1>
              <Paper className="welcome-text">
                <h4>MetaSeek brings together sequencing metadata from all the major repositories to let you easily search, filter, and curate sequencing datasets for your meta-analysis.</h4>
              </Paper>
              <h1>How to use MetaSeek</h1>
              <div>

              <Paper className="explore-preview-sheet">
                <div className="explore-preview-sheet-left">
                  <img src="./images/explore.jpeg"></img>
                </div>
                <div className="explore-preview-sheet-right">
                  <h3>Explore Datasets</h3>
                    <p>Search and filter on the metadata you care about</p>
                  <h3>Save and share your discovery</h3>
                    <p>Get dummy code for data download.</p>
                    <p>Browse other users’ discoveries, save ones you like or use one as a launching off point.</p>
                  <h3>Contribute to the metadata pool</h3>
                    <p>Metadata is only as good as the community it serves.</p>
                    <p>Flag or correct metadata errors, or annotate a dataset or discovery.</p>
                </div>
              </Paper>
            </div>
              <h4>Follow our progress on GitHub, or run your own install of MetaSeek:
              </h4>
              <a className="github-button" href="https://github.com/ahoarfrost/metaseek/subscription" data-style="mega" data-count-href="/ahoarfrost/metaseek/watchers" data-count-api="/repos/ahoarfrost/metaseek#subscribers_count" data-count-aria-label="# watchers on GitHub" aria-label="Watch ahoarfrost/metaseek on GitHub">Watch</a>
          </div>
      </MuiThemeProvider>
    </div>
    )
  }

});

export default Welcome;
