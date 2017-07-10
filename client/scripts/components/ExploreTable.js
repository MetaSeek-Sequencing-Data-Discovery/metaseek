import React from 'react';
import axios from 'axios';
import apiConfig from '../config/api.js';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';
// My component imports
import Header from './Header';

var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var ExploreTable = React.createClass({
  render : function() {
    var tableHeaderStyles = {color:'#fff',fontFamily:'Roboto',fontSize:'18px'};

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
        <div>
            <Table bodyStyle={{overflowX: 'scroll', width:'100%' }} fixedHeader={false} fixedFooter={false} selectable={false} style={{'tableLayout':'auto'}}>
              <TableHeader style={{backgroundColor:'#6369E0'}} adjustForCheckbox={false} displaySelectAll={false} enableSelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn style={tableHeaderStyles}></TableHeaderColumn>
                  <TableHeaderColumn style={{color:'#fff',fontFamily:'Roboto',fontSize:'18px',width: '300px'}}>Study Title</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Link</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Database</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Investigation Type</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Env. Package</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Lib. Source</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Study Type</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Lib. Strategy</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Lib. Screening Strategy</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Lib. Construction Method</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Sequencing Method</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Reads Sequenced</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Avg. Read Length</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Geographic Location</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Biome</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Env. Feature</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Env. Material</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Latitude</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Longitude</TableHeaderColumn>
                  <TableHeaderColumn style={tableHeaderStyles}>Download Size (max run)</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false} preScanRows={false}>
                {this.props.dataTable.datasets.map( (row, index) => (
                  <TableRow selectable={false} key={index}>
                    <TableRowColumn><Link to={row.uri}><RaisedButton label={"Details"} primary={true}></RaisedButton></Link></TableRowColumn>
                    <TableRowColumn style={{width: '300px',whiteSpace:'normal',display:'inline-block',paddingTop:'6px',paddingBottom:'6px',height:'100%'}}>{row.study_title}</TableRowColumn>
                    <TableRowColumn>{row.expt_link}</TableRowColumn>
                    <TableRowColumn>{row.db_source}</TableRowColumn>
                    <TableRowColumn>{row.investigation_type}</TableRowColumn>
                    <TableRowColumn>{row.env_package}</TableRowColumn>
                    <TableRowColumn>{row.library_source}</TableRowColumn>
                    <TableRowColumn>{row.study_type}</TableRowColumn>
                    <TableRowColumn>{row.library_strategy}</TableRowColumn>
                    <TableRowColumn>{row.library_screening_strategy}</TableRowColumn>
                    <TableRowColumn>{row.library_construction_method}</TableRowColumn>
                    <TableRowColumn>{row.sequencing_method}</TableRowColumn>
                    <TableRowColumn>{row.library_reads_sequenced_maxrun}</TableRowColumn>
                    <TableRowColumn>{row.avg_read_length_maxrun}</TableRowColumn>
                    <TableRowColumn>{row.geo_loc_name}</TableRowColumn>
                    <TableRowColumn>{row.env_biome}</TableRowColumn>
                    <TableRowColumn>{row.env_feature}</TableRowColumn>
                    <TableRowColumn>{row.env_material}</TableRowColumn>
                    <TableRowColumn>{row.latitude}</TableRowColumn>
                    <TableRowColumn>{row.longitude}</TableRowColumn>
                    <TableRowColumn>{row.download_size_maxrun}</TableRowColumn>
                  </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="explore-pagination">
              <RaisedButton
                className="explore-pagination-button"
                label="Previous"
                onClick={this.props.getPreviousDataPage}
                disabled={this.props.dataTable.hasPrevious ? false : true}
                primary={true}
              />
              <div className="explore-pagination-count">
                Page {this.props.dataTable.page} of {this.props.dataTable.totalPages}
              </div>
              <RaisedButton
                className="explore-pagination-button"
                label="Next"
                onClick={this.props.getNextDataPage}
                disabled={this.props.dataTable.hasNext ? false : true}
                primary={true}
              />
            </div>
        </div>
      </MuiThemeProvider>
    )
  }
});

export default ExploreTable;
