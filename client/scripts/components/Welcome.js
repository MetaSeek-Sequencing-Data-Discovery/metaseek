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
                <img src="../images/metaseek_workflow.png"/>
              </div>
              <div className="welcome-how-explainer">
                <h2 className="welcome-how-explain-header">Metadata Integration</h2>
                <p className="welcome-how-explain-body">Our metadata scrapers gather metadata for every new public sequencing dataset in the Sequence Read Archive (SRA) across the European, U.S., and Japanese databases. New metadata is added automatically as new datasets become public, so MetaSeek is always up to date.</p>
                <h2 className="welcome-how-explain-header">Constraining Metadata</h2>
                <p className="welcome-how-explain-body">Sequencing metadata in the SRA is encouraged to follow certain standards, with controlled vocabularies for many fields, but this is not always the reality. Where possible, MetaSeek parses incoming metadata to constrain erroneous or mislabeled fields to their corresponding controlled vocabulary value, or to convert user-provided text to a numeric value for fields like latitude and longitude.</p>
                <h2 className="welcome-how-explain-header">Inferring Missing Data</h2>
                <p className="welcome-how-explain-body">Many investigators submit sequencing metadata that is missing essential fields, but these values can be inferred from the context of the other metadata. MetaSeek uses machine learning models to predict controlled vocabularies of some fields, to fill in missing fields.</p>
                <h2 className="welcome-how-explain-header">Fast Metadata Aggregation</h2>
                <p className="welcome-how-explain-body">Easily search over metadata from millions of sequencing datasets in seconds. MetaSeek takes care of querying, summarizing, and visualizing the results.</p>
                <h2 className="welcome-how-explain-header">User-Focused Exploration of Metadata</h2>
                <p className="welcome-how-explain-body">MetaSeek's interactive visualization dashboard makes it easy to understand, explore and edit your metadata query results. Or if you want to really dive deep, use the API.</p>
                <h2 className="welcome-how-explain-header">Save and Export</h2>
                <p className="welcome-how-explain-body">Save metadata discoveries to your account, and browse discoveries from all MetaSeek users. Download metadata for your discovery, and follow our instructions on downloading fasta filesto get started on your investigation.</p>
              </div>
            </div>
            <div className="welcome-footer">
              <h4>Follow our progress on GitHub, or run your own install of MetaSeek:
              </h4>
              <a className="github-button" href="https://github.com/ahoarfrost/metaseek/subscription" data-style="mega" data-count-href="/ahoarfrost/metaseek/watchers" data-count-api="/repos/ahoarfrost/metaseek#subscribers_count" data-count-aria-label="# watchers on GitHub" aria-label="Watch ahoarfrost/metaseek on GitHub">Watch</a>
            </div>
          </div>
      </MuiThemeProvider>
    </div>
    )
  }

});

export default Welcome;
