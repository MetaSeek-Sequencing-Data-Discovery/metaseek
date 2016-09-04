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
  Browse
  Let's us make <Browse/> elements
*/

var Browse = React.createClass({

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
          <h1>Browse Page</h1>
          <Link to='/explore'>
            <p>Explore?</p>
          </Link>
        </div>
      </MuiThemeProvider>
      </div>
    )
  }

});

export default Browse;
