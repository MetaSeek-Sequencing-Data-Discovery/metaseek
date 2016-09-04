import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

/*
  Header
  Top of the full App
*/

var Header = React.createClass({
  handleTitleTouch : function() {
    this.props.history.push('/');
  },
  render : function() {
    return (
    <MuiThemeProvider>
       <AppBar title="MetaSEQ" onTitleTouchTap={this.handleTitleTouch}/>
     </MuiThemeProvider>
    )
  }
});

export default Header;
