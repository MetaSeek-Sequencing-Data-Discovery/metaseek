import React from 'react';

import { Link } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import AppBar from 'material-ui/AppBar';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

/*</ToolbarGroup>
  Header
  Top of the full App
*/

var Header = React.createClass({
  handleTitleTouch : function() {
    this.props.history.push('/');
  },
  render : function() {
    return (
    <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
      <Toolbar className="header-root">
        <ToolbarGroup className="header-logo">
          <Link to='/' className="button-logo-link">
            <img src="../images/logo.png" width="36px" height="36px"/>
            <span className="header-logo-text">etaSeek</span>
          </Link>
        </ToolbarGroup>
        <ToolbarGroup className="header-buttons">
          <Link className="button-link" to='/myaccount'>
            <RaisedButton
              label="My Account"
            />
          </Link>
          <Link className="button-link" to='/explore'>
            <RaisedButton
              label="Explore"
            />
          </Link>
          <Link className="button-link" to='/discoveries'>
            <RaisedButton
              label="Browse"
            />
          </Link>
          <RaisedButton
            label="send feedback!"
            primary={true}
            href="https://www.surveymonkey.com/r/HDT27Y8"
          />
        </ToolbarGroup>
      </Toolbar>
     </MuiThemeProvider>
    )
  }
});

export default Header;
