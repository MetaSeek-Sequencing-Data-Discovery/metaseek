import React from 'react';
// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';


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
              <ListItem>number of datasets - {this.props.activeData.totalDatasets}</ListItem>
              <ListItem>estimated download size - {this.props.activeData.totalDownloadSize}</ListItem>
            </List>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default SummaryStats;
