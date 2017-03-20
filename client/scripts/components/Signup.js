import React from 'react';
import { Link } from 'react-router';

import Formsy from 'formsy-react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {FormsyText} from 'formsy-material-ui/lib';
import Header from './Header';


var Signup = React.createClass({
  getInitialState : function() {
    return {
      canSubmit:false
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
    // stringify removes undefined attributes (for optional metadata params)
    console.log(entry)
  },

  render : function() {
    var errorMessages = {
      emailError: "Please provide a valid email address"
    };
    var styles = {
      container: {
        textAlign: 'center',
        paddingTop: 15,
        width: '80%',
        margin: '0 auto',
        maxWidth: '800px',
        minWidth: '500px'
      },
      paper: {
        'backgroundColor':'#B1B2F6',
        'width':150,
        'height':60,
        'padding':10,
        'textAlign':'left',
        'margin':'0 auto'
      },
      submitStyle: {
        'textAlign':'left',
        'marginTop': 32,
        'padding':15,
        'paddingLeft':25
      }
    };
    return(
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider>
          <div style={styles.container}>
            <h1 style={{'fontSize':'2.6em','marginTop':50,'fontWeight':'bold'}}>Sign up to test the beta version!</h1>
              <Paper style={styles.submitStyle}>
                <Formsy.Form
                 onValid={this.enableButton}
                 onInvalid={this.disableButton}
                 onValidSubmit={this.submitEmail}
                 onInvalidSubmit={this.notifyFormError}
                >
                  <p style={{'fontSize':'1.1em'}}>Enter your email address to be notified when our beta version is released:</p>
                  <FormsyText
                  name="email address"
                  validations="isEmail"
                  validationError={errorMessages.emailError}
                  //required
                  hintText="metaseek.cloud@gmail.com"
                  />
                </Formsy.Form>
              </Paper>
            <h1 style={{'fontSize':'2.6em','marginTop':50}}>Welcome to MetaSeek</h1>
            <p style={{'marginTop':'10px','marginBottom':30}}>Discover, curate, and get access to thousands of sequencing samples from all over the web.</p>
              <div style={{'display':'flex','maxWidth':500,'margin':'0 auto'}}>
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

              <div style={{'width':'600px','position':'absolute', 'left':'50%','top':'50%'}}>
                <div id="architecture img" style={{'float':'left','width':'300px'}}>
                  <img src="./images/architecture.jpeg"/>
                </div>
                <div id="image descriptor" style={{'float':'right','width':'200px','textSize':'1.3em','padding':25}}>
                  <Paper>
                    <p>Metadata is scraped from individual sequencing repositories, unifying field names, complying to MIxS Genomic Standards Consortium metadata standards, and parsing manually-entered values like 'latitude' and 'longitude' to machine-readable format wherever possible.</p>
                  </Paper>
                  <Paper>
                    <p>MetaSeek sends data to the browser in an intelligent way, allowing you to filter, search, and visualize results from the MetaSeek database almost instantaneously.</p>
                  </Paper>
                </div>
              </div>
              <h1 style={{'fontSize':'1.9em','marginTop':60}}>How to use MetaSeek</h1>
              <h2>Explore Datasets</h2>
              <p>Search and filter on the metadata you care about</p>
              <div>
                <img src="./images/explore.jpeg"/>
              </div>
              <h2>Save and share your discovery</h2>
              <p>Get dummy code for data download.</p>
              <p>Browse other users’ discoveries, save ones you like or use one as a launching off point.</p>
              <h2>Contribute to the metadata pool</h2>
              <p>Metadata is only as good as the community it serves.</p>
              <p>Flag or correct metadata errors, or annotate a dataset or discovery.</p>


          </div>
      </MuiThemeProvider>
    </div>
    )
  }

});

export default Signup;
