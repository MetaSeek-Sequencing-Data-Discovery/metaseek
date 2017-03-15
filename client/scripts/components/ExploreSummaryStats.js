import React from 'react';
// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
        <MuiThemeProvider>
          <div>
            <List>
              <ListItem>number of datasets - {this.props.summaryData.totalDatasets}</ListItem>
              <ListItem>estimated download size - {getReadableFileSizeString(this.props.summaryData.totalDownloadSize)}</ListItem>
            </List>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default SummaryStats;
