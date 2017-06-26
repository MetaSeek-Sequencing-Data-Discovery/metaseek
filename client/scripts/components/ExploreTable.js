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
  getInitialState : function() {
    return {}
  },
  render : function() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
        <div>
            <Table bodyStyle={{overflowX: undefined, width:'2000px' }} fixedHeader={false} fixedFooter={false} selectable={false}>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false} enableSelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn tooltip="id">id</TableHeaderColumn>
                  <TableHeaderColumn tooltip="database">database</TableHeaderColumn>
                  <TableHeaderColumn tooltip="sample_id">sample_id</TableHeaderColumn>
                  <TableHeaderColumn tooltip="investigation_type">investigation_type</TableHeaderColumn>
                  <TableHeaderColumn tooltip="project_name">project_name</TableHeaderColumn>
                  <TableHeaderColumn tooltip="lat_lon">lat_lon</TableHeaderColumn>
                  <TableHeaderColumn tooltip="depth">depth</TableHeaderColumn>
                  <TableHeaderColumn tooltip="alt_elev">alt_elev</TableHeaderColumn>
                  <TableHeaderColumn tooltip="geo_loc_name">geo_loc_name</TableHeaderColumn>
                  <TableHeaderColumn tooltip="collection_date">collection_date</TableHeaderColumn>
                  <TableHeaderColumn tooltip="env_biome">env_biome</TableHeaderColumn>
                  <TableHeaderColumn tooltip="env_feature">env_feature</TableHeaderColumn>
                  <TableHeaderColumn tooltip="env_material">env_material</TableHeaderColumn>
                  <TableHeaderColumn tooltip="env_package">env_package</TableHeaderColumn>
                  <TableHeaderColumn tooltip="seq_meth">seq_meth</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody stripedRows={true} displayRowCheckbox={false} preScanRows={false}>
                {this.props.activeData.map( (row, index) => (
                  <TableRow selectable={false} key={index}>
                    <TableRowColumn>{row.id}</TableRowColumn>
                    <TableRowColumn>{row.database}</TableRowColumn>
                    <TableRowColumn>{row.sample_id}</TableRowColumn>
                    <TableRowColumn>{row.investigation_type}</TableRowColumn>
                    <TableRowColumn>{row.project_name}</TableRowColumn>
                    <TableRowColumn>{row.lat_lon}</TableRowColumn>
                    <TableRowColumn>{row.depth}</TableRowColumn>
                    <TableRowColumn>{row.alt_elev}</TableRowColumn>
                    <TableRowColumn>{row.geo_loc_name}</TableRowColumn>
                    <TableRowColumn>{row.collection_date}</TableRowColumn>
                    <TableRowColumn>{row.env_biome}</TableRowColumn>
                    <TableRowColumn>{row.env_feature}</TableRowColumn>
                    <TableRowColumn>{row.env_material}</TableRowColumn>
                    <TableRowColumn>{row.env_package}</TableRowColumn>
                    <TableRowColumn>{row.seq_meth}</TableRowColumn>
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
