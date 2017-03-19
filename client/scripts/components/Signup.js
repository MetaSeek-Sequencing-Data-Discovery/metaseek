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
        'marginTop': 32,
      }
    };
    return(
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider>
          <div style={styles.container}>
            <h1 style={{'fontSize':'2.6em'}}>Welcome to MetaSeek</h1>
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
              <h1 style={{'fontSize':'2.3em','marginTop':50}}>Sign up to test the beta version!</h1>
                <Paper style={styles.submitStyle}>
                  <Formsy.Form
                   onValid={this.enableButton}
                   onInvalid={this.disableButton}
                   onValidSubmit={this.submitEmail}
                   onInvalidSubmit={this.notifyFormError}
                  >
                    <FormsyText
                    name="email address"
                    validations="isEmail"
                    validationError={errorMessages.emailError}
                    //required
                    hintText="metaseek.cloud@gmail.com"
                    floatingLabelText="Enter your email address to be notified when our beta version is released:"
                    />
                  </Formsy.Form>
                </Paper>
              <h1 style={{'fontSize':'1.8em','marginTop':60}}>What is MetaSeek?</h1>
          </div>

      </MuiThemeProvider>
    </div>
    )
  }

});

export default Signup;
