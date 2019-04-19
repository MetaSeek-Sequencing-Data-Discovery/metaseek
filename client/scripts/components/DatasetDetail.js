import React from 'react';
import axios from 'axios';
import apiConfig from '../config/api.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

// My component imports
import Header from './Header';

var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var DatasetDetail = React.createClass({
  getInitialState: function() {
      return {
        'dataset':{}
      }
  },
  componentWillMount: function() {
    var self = this;
    apiRequest.get('/dataset/' + this.props.params.id)
    .then(function (response) {
      self.setState({"dataset": response.data.dataset})
    })
  },

  render : function() {
    const fields = require('../datasetdetailsfields.json');
    const datasets = this.state.dataset;

    return (
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div>
            <Header history={this.props.history}/>
            <Paper className="dataset-sheet" zDepth={2}>
              <div>
              <h2>Dataset Detail</h2>
              {Object.keys(fields).map(function(category) {
                if(category=="Essential Info") {
                  var open = true;
                } else {
                  var open = false;
                };
                console.log(open);
                return(
                  <div>
                  <List>
                    <ListItem
                      style={{fontSize:'18px', fontWeight: 'bold'}}
                      primaryText={category}
                      initiallyOpen={open}
                      nestedItems={[
                        <Table fixedHeader={false} fixedFooter={false} style={{'tableLayout':'auto'}}>
                          <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false} preScanRows={false}>
                            {fields[category].map(function(row, index){
                              if (datasets[row]) {
                                return (
                                  <TableRow selectable={false} key={index}>
                                    <TableRowColumn style={{width:'20%'}}>{row}</TableRowColumn>
                                    <TableRowColumn style={{whiteSpace:'normal'}}>{datasets[row]}</TableRowColumn>
                                  </TableRow>
                                )
                              }
                            })}
                          </TableBody>
                        </Table>
                      ]}
                    />
                  </List>
                  </div>
                )
              })}
              </div>
            </Paper>
          </div>
        </MuiThemeProvider>
    )
  }
});

export default DatasetDetail;
