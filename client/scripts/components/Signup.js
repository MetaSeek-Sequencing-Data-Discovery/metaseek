import React from 'react';
import * as firebase from "firebase";
import firebaseConfig from '../config/firebase.js';
firebase.initializeApp(firebaseConfig);
import axios from 'axios';
import apiConfig from '../config/api.js';

import { Link } from 'react-router';

import Formsy from 'formsy-react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ColorPalette from './ColorPalette';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {FormsyText} from 'formsy-material-ui/lib';
import Header from './Header';

var db = firebase.database();
var signupRef = db.ref("signups");
var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var Signup = React.createClass({
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
        axios.get(response.data.uri).then(function(response){
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
    var styles = {
      container: {
        textAlign: 'center',
        paddingTop: 15,
        width: 1024,
        margin: '0 auto'
      },
      paper: {
        'backgroundColor':'#B1B2F6',
        'width':150,
        'height':60,
        'padding':10,
        'margin':'0 auto'
      },
      submitStyle: {
        'textAlign':'center',
        'margin': '12px auto',
        'width': 400,
        'marginBottom': 25,
        'padding':5
      }
    };

    var exploreButtonDisplay = 'none';
    if (this.state.firebase.admin) {
      exploreButtonDisplay = 'flex';
    }

    return(
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div style={styles.container}>
            <h1 style={{'fontSize':'2.6em','marginTop':50,'fontWeight':'bold'}}>Sign up to test the beta version!</h1>
              <Paper style={styles.submitStyle}>
                {this.state.submitted ? <h2>Thanks for signing up! We'll be in touch soon.</h2> :
                <Formsy.Form
                 onValid={this.enableButton}
                 onInvalid={this.disableButton}
                 onValidSubmit={this.submitEmail}
                 onInvalidSubmit={this.notifyFormError}
                >
                  <p style={{'textAlign':'center','fontSize':'1.1em'}}>Enter your email address to be notified when our beta version is released</p>
                  <FormsyText
                  style={{'display':'block','margin':'0 auto'}}
                  name="email address"
                  validations="isEmail"
                  validationError={errorMessages.emailError}
                  required
                  hintText="metaseek.cloud@gmail.com"
                  />
                  <RaisedButton
                    type="submit"
                    label="Signup"
                    primary={true}
                    style={{marginTop:12,marginBottom:12}}
                  />
                </Formsy.Form>}
              </Paper>
            <h1 style={{'fontSize':'2.6em','marginTop':50}}>Welcome to MetaSeek</h1>
            <p style={{'marginTop':'10px','marginBottom':30}}>Discover, curate, and get access to thousands of sequencing samples from all over the web.</p>
              <div style={{'display':exploreButtonDisplay,'maxWidth':500,'margin':'0 auto'}}>
                <Paper style={styles.paper} zDepth={1}>
                  <Link style={{'display':'block','textAlign':'center'}} to='/explore'>
                    <FlatButton label="DISCOVER"></FlatButton>
                  </Link>
                </Paper>
                <Paper style={styles.paper} zDepth={1}>
                  <Link style={{'display':'block','textAlign':'center'}} to='/dataset/new'>
                    <FlatButton label="CONTRIBUTE"></FlatButton>
                  </Link>
                </Paper>
              </div>
              <h1 style={{'fontSize':'1.9em','marginTop':60}}>What is MetaSeek?</h1>
              <Paper style={{textAlign: 'center',
                      padding: 15,
                      width: '50%',
                      margin: '0 auto',
                      maxWidth: '800px',
                      minWidth: '500px'}}>
                <h3>MetaSeek brings together sequencing metadata from all the major repositories to let you easily search, filter, and curate sequencing datasets for your meta-analysis.</h3>
              </Paper>
              <h1 style={{'fontSize':'1.9em','marginTop':60}}>How to use MetaSeek</h1>
              <div>

              <Paper style={{
                      padding: 15,
                      height: 400}} zDepth={2}>
                      <div style={{float:'left',width:500,'marginLeft':20,'marginTop':40}}>
                        <img src="./images/explore.jpeg"></img>
                      </div>
                      <div style={{float:'right',width:420,marginRight:15}}>
                        <h2>Explore Datasets</h2>
                          <p>Search and filter on the metadata you care about</p>
                        <h2>Save and share your discovery</h2>
                          <p>Get dummy code for data download.</p>
                          <p>Browse other users’ discoveries, save ones you like or use one as a launching off point.</p>
                        <h2>Contribute to the metadata pool</h2>
                          <p>Metadata is only as good as the community it serves.</p>
                          <p>Flag or correct metadata errors, or annotate a dataset or discovery.</p>
                      </div>
              </Paper>

            </div>
              <Paper style={{padding:12,width:'600px','margin':'24px auto 100px'}}>
              <h4>Follow our progress on GitHub, or run your own install of MetaSeek:
              </h4>
              <a className="github-button" href="https://github.com/ahoarfrost/metaseek/subscription" data-style="mega" data-count-href="/ahoarfrost/metaseek/watchers" data-count-api="/repos/ahoarfrost/metaseek#subscribers_count" data-count-aria-label="# watchers on GitHub" aria-label="Watch ahoarfrost/metaseek on GitHub">Watch</a>
              </Paper>
          </div>
      </MuiThemeProvider>
    </div>
    )
  }

});

export default Signup;
