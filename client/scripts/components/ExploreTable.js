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
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
        <div>
            <Table bodyStyle={{overflowX: 'scroll', width:'100%' }} fixedHeader={false} fixedFooter={false} selectable={false} style={{'tableLayout':'auto'}}>
              <TableHeader style={{backgroundColor:'#E9EAFD'}}adjustForCheckbox={false} displaySelectAll={false} enableSelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn>ID</TableHeaderColumn>
                  <TableHeaderColumn>Database UID</TableHeaderColumn>
                  <TableHeaderColumn>Database</TableHeaderColumn>
                  <TableHeaderColumn>Title</TableHeaderColumn>
                  <TableHeaderColumn>Biosample Link</TableHeaderColumn>
                  <TableHeaderColumn>Investigation Type</TableHeaderColumn>
                  <TableHeaderColumn>Lib. Source</TableHeaderColumn>
                  <TableHeaderColumn>Env. Package</TableHeaderColumn>
                  <TableHeaderColumn>Lib. Strategy</TableHeaderColumn>
                  <TableHeaderColumn>Lib. Screening Strategy</TableHeaderColumn>
                  <TableHeaderColumn>Lib. Construction Method</TableHeaderColumn>
                  <TableHeaderColumn>Study Type</TableHeaderColumn>
                  <TableHeaderColumn>Sequencing Method</TableHeaderColumn>
                  <TableHeaderColumn>Instrument Model</TableHeaderColumn>
                  <TableHeaderColumn>Location Name</TableHeaderColumn>
                  <TableHeaderColumn>Latitude</TableHeaderColumn>
                  <TableHeaderColumn>Longitude</TableHeaderColumn>
                  <TableHeaderColumn>Biome</TableHeaderColumn>
                  <TableHeaderColumn>Env. Feature</TableHeaderColumn>
                  <TableHeaderColumn>Env. Material</TableHeaderColumn>
                  <TableHeaderColumn>Avg. Read Length (max run)</TableHeaderColumn>
                  <TableHeaderColumn>GC % (max run)</TableHeaderColumn>
                  <TableHeaderColumn>Lib. Reads Sequenced (max run)</TableHeaderColumn>
                  <TableHeaderColumn>Total # Bases (max run)</TableHeaderColumn>
                  <TableHeaderColumn>Download Size (max run)</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false} preScanRows={false}>
                {this.props.dataTable.datasets.map( (row, index) => (
                  <TableRow selectable={false} key={index}>
                    <TableRowColumn><Link to={row.uri}><RaisedButton label={row.id} primary={true}></RaisedButton></Link></TableRowColumn>
                    <TableRowColumn>{row.db_source_uid}</TableRowColumn>
                    <TableRowColumn>{row.db_source}</TableRowColumn>
                    <TableRowColumn>{row.sample_title}</TableRowColumn>
                    <TableRowColumn>{row.biosample_link}</TableRowColumn>
                    <TableRowColumn>{row.investigation_type}</TableRowColumn>
                    <TableRowColumn>{row.library_source}</TableRowColumn>
                    <TableRowColumn>{row.env_package}</TableRowColumn>
                    <TableRowColumn>{row.library_strategy}</TableRowColumn>
                    <TableRowColumn>{row.library_screening_strategy}</TableRowColumn>
                    <TableRowColumn>{row.library_construction_method}</TableRowColumn>
                    <TableRowColumn>{row.study_type}</TableRowColumn>
                    <TableRowColumn>{row.sequencing_method}</TableRowColumn>
                    <TableRowColumn>{row.instrument_model}</TableRowColumn>
                    <TableRowColumn>{row.geo_loc_name}</TableRowColumn>
                    <TableRowColumn>{row.latitude}</TableRowColumn>
                    <TableRowColumn>{row.longitude}</TableRowColumn>
                    <TableRowColumn>{row.env_biome}</TableRowColumn>
                    <TableRowColumn>{row.env_feature}</TableRowColumn>
                    <TableRowColumn>{row.env_material}</TableRowColumn>
                    <TableRowColumn>{row.avg_read_length_maxrun}</TableRowColumn>
                    <TableRowColumn>{row.gc_percent_maxrun}</TableRowColumn>
                    <TableRowColumn>{row.library_reads_sequenced_maxrun}</TableRowColumn>
                    <TableRowColumn>{row.total_num_bases_maxrun}</TableRowColumn>
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
