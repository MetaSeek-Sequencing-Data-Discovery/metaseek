import React from 'react';
import { Link } from 'react-router';

// Material Design stuff
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/*
  Welcome
  Let's us make <Welcome/> elements
*/
// My component imports
import Header from './Header';

var Welcome = React.createClass({
  getInitialState : function() {
    return {
        open: false,
    }
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
    return (
      <div>
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
          <Link to='/browse'>
            <RaisedButton
            label="Super Secret Password"
            secondary={true}
            onTouchTap={this.handleTouchTap}
            />
          </Link>
        </div>
      </MuiThemeProvider>
        <Header/>
      </div>
    )
  }

});

export default Welcome;
