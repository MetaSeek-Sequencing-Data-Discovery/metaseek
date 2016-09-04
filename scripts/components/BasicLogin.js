import React from 'react';
import { History } from 'react-router';
import helpers from '../helpers.js';

// Material Design stuff
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

/*
  BasicLogin
  Let's us make <BasicLogin/> elements
*/

var BasicLogin = React.createClass({
  mixins : [History],

  getInitialState : function() {
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    return {
        open: false,
    }
  },
  goToStore : function(e) {
    e.preventDefault();
    var storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId);
  },

  handleRequestClose : function() {
    this.setState({
      open: false,
    });
  },

  handleTouchTap : function() {
    this.setState({
      open: true,
    });
  },

  render : function() {
    var muiTheme = getMuiTheme({
      palette: {
        accent1Color: deepOrange500,
      },
    });

    var standardActions = (
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleRequestClose}
      />
    );

    var styles = {
      container: {
        textAlign: 'center',
        paddingTop: 200,
      },
    };

    var name = "Nick";
    return (
      <div>
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter a Store {name}</h2>
        <input type="text" ref="storeId" required defaultValue={helpers.getFunName()}/>
        <input type="Submit" defaultValue="Submit"/>
      </form>
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Dialog
            open={this.state.open}
            title="Super Secret Password"
            actions={standardActions}
            onRequestClose={this.handleRequestClose}
          >
            1-2-3-4-5
          </Dialog>
          <h1>Material-UI</h1>
          <h2>example project</h2>
          <RaisedButton
            label="Super Secret Password"
            secondary={true}
            onTouchTap={this.handleTouchTap}
          />
        </div>
      </MuiThemeProvider>
      </div>
    )
  }

});

export default BasicLogin;
