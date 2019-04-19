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
import MailChimpSignup from './MailChimpSignup';

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
    };

    return(
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div className="welcome-container">
            <div className="welcome-first">
              <h1 className="welcome-title">Welcome to MetaSeek</h1>
              <h3 className="welcome-text">Discover, curate, and get access to thousands of sequencing samples from all over the web.</h3>
              <p className="subscribe-form-label">Join our mailing list to receive (very rare) updates on major events here at MetaSeek</p>
              {this.state.submitted ? <h2 className="welcome-text">Thanks for signing up! We'll be in touch soon.</h2> :
              <MailChimpSignup />
              }
            </div>
            <div className="welcome-features">
              <div className="feature-block">
                <img src="../images/explore_icon.jpg"/>
                <h1 className="feature-block-title">Explore</h1>
                <p className="feature-block-body">Search and filter metadata from millions of next-generation sequencing datasets to find the data you care about in seconds. Quickly curate integrated sequencing datasets to answer your scientific questions. </p>
              </div>
              <div className="feature-block">
                <img src="../images/discovery_icon.jpg"/>
                <h1 className="feature-block-title">Discover</h1>
                <p className="feature-block-body">Save discoveries to your account and share with the MetaSeek community. Browse discoveries from other users, save the ones you like or use one as a launching off point for your own exploration. </p>
              </div>
              <div className="feature-block">
                <img src="../images/launch_icon.jpg"/>
                <h1 className="feature-block-title">Create</h1>
                <p className="feature-block-body">Get past the data integration step and to your real science, faster. Download dataset metadata, and follow our easy guides to get from dataset lists to fasta files in no time.</p>
              </div>
            </div>
            <div className="welcome-how">
              <div>
                <h1 className="welcome-how-header">What is MetaSeek?</h1>
                <h3 className="welcome-how-subheader">MetaSeek brings together sequencing metadata from all the major repositories to let you easily search, filter, and curate sequencing datasets for your meta-analysis.</h3>
                <h1 className="welcome-how-header">How MetaSeek Works</h1>
              </div>
              <div className="welcome-how-graphic">
                <img src="../images/HowMetaSeekWorks_nobkgd.png"/>
              </div>
            </div>
            <div className="welcome-footer">
              <h4>Follow our progress on GitHub, or better yet, contribute!
              </h4>
              <a className="github-button" href="https://github.com/MetaSeek-Sequencing-Data-Discovery/metaseek/subscription" data-style="mega" data-count-href="/ahoarfrost/metaseek/watchers" data-count-api="/repos/ahoarfrost/metaseek#subscribers_count" data-count-aria-label="# watchers on GitHub" aria-label="Watch ahoarfrost/metaseek on GitHub">Watch</a>
            </div>
          </div>
      </MuiThemeProvider>
    </div>
    )
  }

});

export default Welcome;
