import React from 'react';

import { Link } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

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
       <AppBar
        title={<span style={{'cursor':'pointer'}}>MetaSeek</span>}
        onTitleTouchTap={this.handleTitleTouch}
        iconElementLeft={<div></div>}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <Link style={{'text-decoration':'none'}} to='/myaccount'>
              <MenuItem primaryText="My Account" />
            </Link>
          </IconMenu>
        }
      />
     </MuiThemeProvider>
    )
  }
});

export default Header;
