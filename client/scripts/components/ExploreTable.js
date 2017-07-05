import React from 'react';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
from 'material-ui/Table';

// My component imports
import Header from './Header';

var ExploreTable = React.createClass({
  render : function() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
        <div>
            <Table bodyStyle={{overflowX: undefined, width:'2000px' }} fixedHeader={false} fixedFooter={false} selectable={false} style={{'tableLayout':'auto'}}>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false} enableSelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn tooltip="id">id</TableHeaderColumn>
                  <TableHeaderColumn tooltip="url">URL</TableHeaderColumn>
                  <TableHeaderColumn tooltip="db_source_uid">db_source_uid</TableHeaderColumn>
                  <TableHeaderColumn tooltip="db_source">db_source</TableHeaderColumn>
                  <TableHeaderColumn tooltip="sample_title">sample_title</TableHeaderColumn>
                  <TableHeaderColumn tooltip="biosample_link">biosample_link</TableHeaderColumn>
                  <TableHeaderColumn tooltip="investigation_type">investigation_type</TableHeaderColumn>
                  <TableHeaderColumn tooltip="library_source">library_source</TableHeaderColumn>
                  <TableHeaderColumn tooltip="env_package">env_package</TableHeaderColumn>
                  <TableHeaderColumn tooltip="library_strategy">library_strategy</TableHeaderColumn>
                  <TableHeaderColumn tooltip="library_screening_strategy">library_screening_strategy</TableHeaderColumn>
                  <TableHeaderColumn tooltip="library_construction_method">library_construction_method</TableHeaderColumn>
                  <TableHeaderColumn tooltip="study_type">study_type</TableHeaderColumn>
                  <TableHeaderColumn tooltip="sequencing_method">sequencing_method</TableHeaderColumn>
                  <TableHeaderColumn tooltip="instrument_model">instrument_model</TableHeaderColumn>
                  <TableHeaderColumn tooltip="geo_loc_name">geo_loc_name</TableHeaderColumn>
                  <TableHeaderColumn tooltip="env_biome">env_biome</TableHeaderColumn>
                  <TableHeaderColumn tooltip="env_feature">env_feature</TableHeaderColumn>
                  <TableHeaderColumn tooltip="env_material">env_material</TableHeaderColumn>
                  <TableHeaderColumn tooltip="avg_read_length_maxrun">avg_read_length_maxrun</TableHeaderColumn>
                  <TableHeaderColumn tooltip="gc_percent_maxrun">gc_percent_maxrun</TableHeaderColumn>
                  <TableHeaderColumn tooltip="latitude">latitude</TableHeaderColumn>
                  <TableHeaderColumn tooltip="longitude">longitude</TableHeaderColumn>
                  <TableHeaderColumn tooltip="library_reads_sequenced_maxrun">library_reads_sequenced_maxrun</TableHeaderColumn>
                  <TableHeaderColumn tooltip="total_num_bases_maxrun">total_num_bases_maxrun</TableHeaderColumn>
                  <TableHeaderColumn tooltip="download_size_maxrun">download_size_maxrun</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody stripedRows={true} displayRowCheckbox={false} preScanRows={false}>
                {this.props.dataTable.datasets.map( (row, index) => (
                  <TableRow selectable={false} key={index}>
                    <TableRowColumn>{row.id}</TableRowColumn>
                    <TableRowColumn>{row.uri}</TableRowColumn>
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
                    <TableRowColumn>{row.env_biome}</TableRowColumn>
                    <TableRowColumn>{row.env_feature}</TableRowColumn>
                    <TableRowColumn>{row.env_material}</TableRowColumn>
                    <TableRowColumn>{row.avg_read_length_maxrun}</TableRowColumn>
                    <TableRowColumn>{row.gc_percent_maxrun}</TableRowColumn>
                    <TableRowColumn>{row.latitude}</TableRowColumn>
                    <TableRowColumn>{row.longitude}</TableRowColumn>
                    <TableRowColumn>{row.library_reads_sequenced_maxrun}</TableRowColumn>
                    <TableRowColumn>{row.total_num_bases_maxrun}</TableRowColumn>
                    <TableRowColumn>{row.download_size_maxrun}</TableRowColumn>
                  </TableRow>
                  ))}
              </TableBody>
            </Table>
        </div>
      </MuiThemeProvider>
    )
  }
});

export default ExploreTable;
