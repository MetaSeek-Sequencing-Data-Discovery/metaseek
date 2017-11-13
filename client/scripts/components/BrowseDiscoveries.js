import React from 'react';
import Firebase from 'firebase';
import axios from 'axios';
import apiConfig from '../config/api.js';
import { Link } from 'react-router';

// Material Design stuff
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ColorPalette from './ColorPalette';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import Header from './Header';

var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var BrowseDiscoveries = React.createClass({
  getInitialState: function() {
      return {
        'discoveries': []
      }
  },

  componentWillMount: function() {
    var self = this;
    apiRequest.get("/discoveries")
    .then(function (response) {
      self.setState({"discoveries": response.data.discoveries});
    });
  },

  render : function() {
    return (
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div>
            <h1 className="browse-discoveries-header">{"Viewing " + this.state.discoveries.length + " MetaSeek Discoveries"}</h1>
            <Paper className="browse-discoveries-table">
              <Table bodyStyle={{overflowX: 'scroll', width:'100%' }} fixedHeader={false} fixedFooter={false} selectable={false} style={{'tableLayout':'auto'}}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false} enableSelectAll={false}>
                  <TableRow selectable={false}>
                    <TableHeaderColumn style={{color:"#fff",fontFamily:"Roboto",fontSize:"20px",fontWeight:600}}>Discovery Title</TableHeaderColumn>
                    <TableHeaderColumn style={{color:"#fff",fontFamily:"Roboto",fontSize:"20px",fontWeight:600}}>No. of Datasets</TableHeaderColumn>
                    <TableHeaderColumn style={{color:"#fff",fontFamily:"Roboto",fontSize:"20px",fontWeight:600}}>Created By</TableHeaderColumn>
                    <TableHeaderColumn style={{color:"#fff",fontFamily:"Roboto",fontSize:"20px",fontWeight:600}}>Date Created</TableHeaderColumn>
                    <TableHeaderColumn></TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody showRowHover={false} stripedRows={false} displayRowCheckbox={false} preScanRows={false}>
                  {this.state.discoveries.reverse().map( (discovery, index) => (
                    <TableRow selectable={false} key={index}>
                      <TableRowColumn style={{fontSize: "18px", width: "85%"}} >{discovery.discovery_title}</TableRowColumn>
                      <TableRowColumn style={{fontSize: "18px", width: "85%"}} >{discovery.num_datasets}</TableRowColumn>
                      <TableRowColumn style={{fontSize: "18px", width: "85%"}} >{discovery.owner.firebase_name}</TableRowColumn>
                      <TableRowColumn>{discovery.timestamp.substr(5, 20)}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>
                        <Link to={discovery.uri}>
                        <RaisedButton label={"discovery details"} secondary={true} />
                        </Link>
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default BrowseDiscoveries;
