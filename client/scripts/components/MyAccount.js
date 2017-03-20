import React from 'react';

import Firebase from 'firebase';

// Material Design stuff
import RaisedButton from 'material-ui/RaisedButton';
import Header from './Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

/*
  MyAccount
  Let's us make <MyAccount/> elements
*/

var MyAccount = React.createClass({
  getInitialState: function() {
      return {
        'firebase':{
          'uid':null,
          'name':null,
          'photo':null
        }
      }
  },

  componentWillMount: function() {
    var user = Firebase.auth().currentUser;
    if (user) {
      this.state.firebase.name = user.displayName;
      this.state.firebase.uid = user.uid;
      this.state.firebase.photo = user.photoURL;
      this.setState(this.state.firebase);
    }
  },

  triggerLogin : function() {
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

  render : function() {
    var styles = {
      container: {
        textAlign: 'center',
        paddingTop: 20,
      },
    };

    var headline = "You're not logged in. Want to log in?";
    if (this.state.firebase.uid) {
      var headline = "Hey, you're logged in as " + this.state.firebase.name;
    }

    return (
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider>
          <Paper style={{'width':'60%','margin':'25px auto'}} zDepth={2}>
          <div style={styles.container}>
            <h1>{headline}</h1>
            <div>
               <img style={{'width':'150px','height':'150px','display':this.state.firebase.uid ? 'inline' : 'none'}} src={this.state.firebase.photo}/>
            </div>
            <RaisedButton style={{'margin':'20px 20px 20px 20px'}}
              label="Log In"
              onClick={this.triggerLogin}
              primary={true}
              disabled={this.state.firebase.uid}
            />
            <RaisedButton style={{'margin':'20px 20px 20px 20px'}}
              label="Log Out"
              onClick={this.triggerLogout}
              primary={true}
              disabled={!(this.state.firebase.uid)}
            />
          </div>
          </Paper>
        </MuiThemeProvider>
      </div>
    )
  }

});

export default MyAccount;
