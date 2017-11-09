import React from 'react';
import Firebase from 'firebase';
import axios from 'axios';
import apiConfig from '../config/api.js';
import { Link } from 'react-router';

// Material Design stuff
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ColorPalette from './ColorPalette';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import Header from './Header';

var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var MyAccount = React.createClass({
  getInitialState: function() {
      return {
        'firebase':{
          'uid':null,
          'name':null,
          'photo':null
        },
        'discoveries': [],
        'mailingListOpen': false
      }
  },

  componentWillMount: function() {
    var user = Firebase.auth().currentUser;
    var self = this;
    if (user) {
      apiRequest.get("/user/"+user.uid+"/discoveries")
      .then(function (response) {
        self.setState({"discoveries": response.data.discoveries});
      });
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
    var self = this;
    self.state.firebase.name = user.displayName;
    self.state.firebase.uid = user.uid;
    self.state.firebase.photo = user.photoURL;
    apiRequest.post("/user/create", {
      "firebase_id":self.state.firebase.uid,
      "firebase_name":self.state.firebase.name,
      "admin":0
    }).then(function(response){
      console.log(response);
      if (response.data.user) {
          self.setState({"mailingListOpen": true});
      }
      self.setState({"firebase": self.state.firebase});
    });

    apiRequest.get("/user/"+user.uid+"/discoveries")
    .then(function (response) {
      self.setState({"discoveries": response.data.discoveries});
    });

    this.setState(this.state.firebase);

  },

  mailingListClose : function () {
    this.setState({"mailingListOpen": false});
  },

  render : function() {
    if (!this.state.firebase.uid) return (
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <Paper className="myacct-loggedout" >
            <h3>Log in with Google to view your MetaSeek account.</h3>
            <div className="login-buttons">
              <RaisedButton
                label="Sign Up/Log In With Google"
                onClick={this.triggerLogin}
                primary={true}
                disabled={this.state.firebase.uid}
              />
            </div>
          </Paper>
        </MuiThemeProvider>
      </div>
    );

    const mailingList_actions = [
      <div className="subscribe-explore-yes">
        <form action="https://cloud.us16.list-manage.com/subscribe/post" method="POST" target="_blank" onSubmit={this.mailingListClose}>
          <input type="hidden" name="u" value="cf5bea2cc22645d3e92a973df" />
          <input type="hidden" name="id" value="dc5deb63f1" />
          <div id="mergeTable">
            <div>
                <input className="subscribe-button" type="submit" name="submit" value="Subscribe to list" />
            </div>
          </div>
        </form>
      </div>,
      <div className="subscribe-explore-no">
        <FlatButton
          label="No thanks"
          primary={true}
          onClick={this.mailingListClose}
        />
      </div>
    ];

    return (
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div>
            <Dialog
              title={"Welcome to MetaSeek, "+this.state.firebase.name+"!"}
              actions={mailingList_actions}
              modal={true}
              open={this.state.mailingListOpen}
            >
            <h4 className="subscribe-explore-body">Join our mailing list to receive (very rare) updates on major events here at MetaSeek</h4>
            </Dialog>
            <Paper className="myacct-loggedin" >
              <div>
                 <img className="profile-image-myacct" src={this.state.firebase.photo}/>
              </div>
              <div className="myacct-user">
                <h2 className="myacct-name">{this.state.firebase.name}</h2>
                <span className="discovery-header-user myacct-user-discoveries">{this.state.discoveries.length + " saved discoveries"}</span>
                <div className="myacct-logout-button">
                  <RaisedButton
                    label="Log Out"
                    onClick={this.triggerLogout}
                  />
                </div>
              </div>
            </Paper>

            <Paper className="user-discoveries-table">
              <Table bodyStyle={{overflowX: 'scroll', width:'100%' }} fixedHeader={false} fixedFooter={false} selectable={false} style={{'tableLayout':'auto'}}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false} enableSelectAll={false}>
                  <TableRow selectable={false}>
                    <TableHeaderColumn style={{color:"#fff",fontFamily:"Roboto",fontSize:"20px",fontWeight:600}} className="user-discoveries-table-header">{this.state.discoveries.length + " Discoveries"}</TableHeaderColumn>
                    <TableHeaderColumn style={{color:"#fff",fontFamily:"Roboto",fontSize:"20px",fontWeight:600}} className="user-discoveries-table-header">Date Created</TableHeaderColumn>
                    <TableHeaderColumn></TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody showRowHover={false} stripedRows={false} displayRowCheckbox={false} preScanRows={false}>
                  {this.state.discoveries.reverse().map( (discovery, index) => (
                    <TableRow selectable={false} key={index}>
                      <TableRowColumn style={{fontSize: "18px", width: "85%"}} >{discovery.discovery_title}</TableRowColumn>
                      <TableRowColumn>{discovery.timestamp.substr(5, 20)}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>
                        <Link to={discovery.uri}>
                        <RaisedButton label={"discovery details"} secondary={true} />
                        </Link>
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default MyAccount;
