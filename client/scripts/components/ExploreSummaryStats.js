import React from 'react';
// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ColorPalette from './ColorPalette';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
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
            <List className="summaryBox" >
              <ListItem><b style={{"display":"inline-block","color":"#6369E0"}}>{this.props.summaryData.totalDatasets}</b> datasets </ListItem>
              <ListItem><b style={{"display":"inline-block","color":"#6369E0"}}>{getReadableFileSizeString(this.props.summaryData.totalDownloadSize)}</b>   estimated download size </ListItem>
            </List>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default SummaryStats;
