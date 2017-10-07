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
      <Toolbar>
        <ToolbarTitle text="MetaSeek" />
        <ToolbarGroup>
          <Link className="button-link" to='/myaccount'>
            <FlatButton
              label="My Account"
              primary={true}
            />
          </Link>
          <Link className="button-link" to='/explore'>
            <FlatButton
              label="Explore"
              primary={true}
            />
          </Link>
        </ToolbarGroup>
        <ToolbarGroup >
          <RaisedButton
            label="send feedback!"
            primary={true}
            href="https://www.surveymonkey.com/r/HDT27Y8"
          />
          <div>
             <img className="header-image-beta" src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Beta-badge.svg"/>
          </div>
        </ToolbarGroup>
      </Toolbar>
     </MuiThemeProvider>
    )
  }
});

export default Header;
