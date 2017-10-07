import React from 'react';
import axios from 'axios';
import apiConfig from '../config/api.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

// My component imports
import Header from './Header';
import VizDashboard from './VizDashboard';
import Loading from './Loading';
import {getReadableFileSizeString} from '../helpers';
import ExploreTable from './ExploreTable';

var apiRequest = axios.create({
  baseURL: apiConfig.baseURL
});

var DiscoveryDetail = React.createClass({
  getInitialState: function() {
    return {
      'discovery':{},
      'summaryData': [],
      'loaded': false,
      'dataTable': {
        'datasets': [],
        'hasNext': false,
        'hasPrevious' : false,
        'nextUri' : "/datasets/search/2"
      },
      'downloadingIds': false,
      'downloadingMetadata' : false
    }
  },
  componentWillMount: function() {
    var self = this;
    apiRequest.get('/discovery/' + this.props.params.id)
    .then(function (response) {
      self.setState({"discovery": response.data.discovery});
      apiRequest.post("/datasets/search/summary", {
        "filter_params":response.data.discovery.filter_params
      }).then(function (response) {
        self.setState({"summaryData": response.data.summary, "loaded":true});
        apiRequest.post("/datasets/search/1", {
          "filter_params":self.state.discovery.filter_params,
        }).then(function (response) {
          self.setState({"dataTable":response.data,"loaded":true});
        })
      });

    });
  },

  getPreviousDataPage : function() {
    var self = this;
    apiRequest.post(self.state.dataTable.previousUri, {
      "filter_params":self.state.discovery.filter_params
    }).then(function (response) {
      self.setState({"dataTable":response.data});
    });
  },

  getNextDataPage : function() {
    var self = this;
    apiRequest.post(self.state.dataTable.nextUri, {
      "filter_params":self.state.discovery.filter_params
    }).then(function (response) {
      self.setState({"dataTable":response.data});
    });
  },

  toCSV : function(data, separator) {
    const csv = data.map((row, index) => row.map((element) => "\"" + element + "\"").join(separator)).join(`\n`);
    return (csv);
  },

  downloadCSV : function(output, filename) {
    var downloadLink = document.createElement("a");
    downloadLink.href = output;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  },

  toCSVJSON : function(jsons, separator) {
    const headers = Array.from(
     jsons.map(json => Object.keys(json))
     .reduce((a, b) => new Set([...a, ...b]), [])
    );
    const data = jsons.map((object) => headers.map((header) => (header in object) ? object[header] : ''));
    const input = [headers, ...data];
    const csv = input.map((row, index) => row.map((element) => "\"" + element + "\"").join(separator)).join(`\n`);
    return (csv);
  },

  downloadIds : function() {
    var self = this;
    apiRequest.post("/datasets/search/ids", {
      "filter_params":self.state.discovery.filter_params
    }).then(function (response) {
      self.setState({"downloadingIds":true});
      const csv = self.toCSV(response.data, ",");
      const output = encodeURI(`data:text/csv;charset=utf-8,\uFEFF${csv}`);
      console.log(csv);
      console.log(output);
      self.downloadCSV(output, self.state.discovery.discovery_title + "_datasetIds.csv");
    });
  },
/*
  downloadMetadata : function() {
    var self = this;
    apiRequest.post("/datasets/search/metadata", {
      "filter_params":self.state.discovery.filter_params
    }).then(function (response) {
      self.setState({"downloadingMetadata":true});
      const csv = self.toCSV(response.data, ",");
      const output = encodeURI(`data:text/csv;charset=utf-8,\uFEFF${csv}`);
      self.downloadCSV(output, self.state.discovery.discovery_title + "_datasetMetadata.csv");
    });
  },
*/
  downloadMetadataJSON : function() {
  var self = this;
  self.setState({"downloadingMetadata":true});
  apiRequest.get('/datasets/search/metadata/' + this.props.params.id)
  .then(function (response) {
    const csv = self.toCSVJSON(response.data.datasetMetadata, ",");
    const output = encodeURI(`data:text/csv;charset=utf-8,\uFEFF${csv}`);
    const finaloutput = output.replace("-", "%2D", output);
    console.log(finaloutput); 
    self.downloadCSV(finaloutput, self.state.discovery.discovery_title + "_datasetMetadata.csv");
  });
},

  metadataDownloadLabel : function(threshold) {
    if (this.state.downloadingMetadata) {
      return "your metadata is being downloaded"
    } else {
      if (this.state.summaryData.total_datasets < threshold) {
        return "Download Full Metadata as .csv (~"+getReadableFileSizeString(this.state.summaryData.total_datasets*90*8)+")"
      } else {
        return "Data is too big for full download. Use the API!"
      }
    }
  },

  render: function() {
    if (!this.state.loaded) return <Loading/>;
    var tableHeaderStyles = {color:'#fff',fontFamily:'Roboto',fontSize:'14px',fontWeight:700};

    const ruletypes = JSON.parse("{\"0\":\"=\", \"1\":\"<\", \"2\":\">\", \"3\":\"<=\", \"4\":\">=\", \"5\":\"=\", \"6\":\"!=\", \"7\":\"contains\", \"8\":\"is equal to\", \"9\": \"is not equal to\", \"10\":\"is not none\"}");

    const n_threshold = 10000;

    return (
      <div>
        <Header history={this.props.history}/>
          <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
            <div className="explore-container">
              <Paper className="discovery-header card three" >
                <h2>{this.state.discovery.discovery_title}</h2>
                <h3>Discovery Details</h3>
                <div className="discovery-description">
                    <span>{this.state.discovery.discovery_description}</span>
                </div>
                <div className="discovery-header-summary">
                  <div className="discovery-header-summary-left">
                    <span className="filterparam-table-title">Filter Parameters</span>
                    <div className="discovery-filterparam-table-container">
                      <Table className="filterparam-table" bodyStyle={{overflowX: 'scroll'}} fixedHeader={false} fixedFooter={false} selectable={false} style={{'tableLayout':'auto', 'overflow':'visible'}}>
                        <TableHeader style={{backgroundColor:'#7075E0'}} adjustForCheckbox={false} displaySelectAll={false} enableSelectAll={false}>
                          <TableRow selectable={false}>
                            <TableHeaderColumn style={tableHeaderStyles}>Field</TableHeaderColumn>
                            <TableHeaderColumn style={tableHeaderStyles}>Filter Type</TableHeaderColumn>
                            <TableHeaderColumn style={tableHeaderStyles}>Value</TableHeaderColumn>
                          </TableRow>
                        </TableHeader>
                        <TableBody showRowHover={false} stripedRows={false} displayRowCheckbox={false} preScanRows={false}>
                          {JSON.parse(this.state.discovery.filter_params)["rules"].map( (rule, index) => (
                            <TableRow selectable={false} key={index}>
                              <TableRowColumn>{rule.field}</TableRowColumn>
                              <TableRowColumn>{ruletypes[JSON.stringify(rule.type)]}</TableRowColumn>
                              <TableRowColumn>{JSON.stringify(rule.value)}</TableRowColumn>
                            </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="discovery-header-summary-right">
                    <span className="discovery-header-first"><span className="active">{this.state.summaryData.total_datasets} datasets</span></span>
                    <span className="discovery-header-second"> {getReadableFileSizeString(this.state.summaryData.total_download_size)} <span className="overview-title">Estimated Total Download Size</span></span>
                    <span className="discovery-header-user"><span>{"saved by metaseek user "+this.state.discovery.owner.firebase_name+" on "+this.state.discovery.timestamp.substr(0,16)}</span></span>
                  </div>
                </div>
                <div className="download-button-container">
                  <RaisedButton className="download-button-metadata"
                    label={this.state.downloadingIds ? "your IDs are being downloaded" : "Download Dataset Ids as .csv (~"+getReadableFileSizeString(this.state.summaryData.total_datasets*4*8)+")"}
                    onClick={this.downloadIds}
                    primary={true}
                    disabled={this.state.downloadingIds ? true : false}
                  />
                <RaisedButton className="download-button-metadata"
                    label={this.metadataDownloadLabel(n_threshold)}
                    onClick={this.downloadMetadataJSON}
                    primary={true}
                    disabled={this.state.downloadingMetadata || this.state.summaryData.total_datasets > n_threshold ? true : false}
                  />
                </div>
              </Paper>

              <Paper className="explore-table card three">
                <div className="discovery-datasets-title-container">
                    <span className="discovery-datasets-title">Datasets in This Discovery</span>
                </div>
                <ExploreTable getNextDataPage={this.getNextDataPage} getPreviousDataPage={this.getPreviousDataPage} dataTable={this.state.dataTable}/>
              </Paper>
              <VizDashboard activeSummaryData={this.state.summaryData}/>
            </div>
          </MuiThemeProvider>
      </div>

    )
  }
});

export default DiscoveryDetail;
