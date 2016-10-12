import React from 'react';

import Firebase from 'firebase';

// Material Design stuff
import RaisedButton from 'material-ui/RaisedButton';
import Header from './Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/*
  MyAccount
  Let's us make <MyAccount/> elements
*/

var MyAccount = React.createClass({
  getInitialState: function() {
      return {
        'uid':null,
        'name':null
      }
  },

  componentWillMount: function() {
    var user = Firebase.auth().currentUser;
    if (user) {
      this.state.name = user.displayName;
      this.state.uid = user.uid;
      this.setState(this.state);
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
      accountComponent.state.name = null;
      accountComponent.state.uid = null;
      accountComponent.setState(accountComponent.state);
    }, function(error) {
      console.log("couldn't log out for some reason");
      console.log(error);
    });
  },

  successfulLogin : function(user) {
    this.state.name = user.displayName;
    this.state.uid = user.uid;
    this.setState(this.state);
  },

  render : function() {
    var styles = {
      container: {
        textAlign: 'center',
        paddingTop: 200,
      },
    };

    var headline = "You're not logged in. Want to log in?";
    if (this.state.uid) {
      var headline = "Hey, you're logged in as " + this.state.name;
    }

    return (
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider>
          <div style={styles.container}>
            <h1>{headline}</h1>
            <RaisedButton style={{'margin':'20px 20px 20px 20px'}}
              label="Log In"
              onClick={this.triggerLogin}
              primary={true}
            />
            <RaisedButton style={{'margin':'20px 20px 20px 20px'}}
              label="Log Out"
              onClick={this.triggerLogout}
              primary={true}
            />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }

});

export default MyAccount;
