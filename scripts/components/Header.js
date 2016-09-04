import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

/*
  Header
  Top of the full App
*/

var Header = React.createClass({
  render : function() {
    return (
      <MuiThemeProvider>
       <AppBar title="MetaSEQ" />
     </MuiThemeProvider>
    )
  }
});

export default Header;
