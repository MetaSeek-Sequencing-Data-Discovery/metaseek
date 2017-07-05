import React from 'react';
// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import {getReadableFileSizeString} from '../helpers';


var SummaryStats = React.createClass({
  getInitialState: function() {
      return {}
  },

  render : function() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div>
            <List>
              <ListItem><span className="callout">{this.props.activeSummaryData.total_datasets}</span> datasets.</ListItem>
              <ListItem><span className="callout">{getReadableFileSizeString(this.props.activeSummaryData.total_download_size)}</span> estimated download size.</ListItem>
            </List>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default SummaryStats;
