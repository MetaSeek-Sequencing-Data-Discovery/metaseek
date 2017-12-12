import React from 'react';

import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionHelpOutline from 'material-ui/svg-icons/action/help-outline';

import HistogramVictory from './HistogramVictory';
import AreaChart from './AreaChart';
import WordCloud from './WordCloud';
import RadarChart from './RadarChart';
import PieVictory from './PieVictory';
import MapDeckGL from './MapDeckGL';
import MapLegend from './MapLegend';

import BPTheme from './CustomVictoryTheme_BP';
import TurquoiseTheme from './CustomVictoryTheme_turquoise';
import YellowTheme from './CustomVictoryTheme_Y';
import VictoryTheme from './CustomVictoryTheme';



var VizDashboard = React.createClass({
  getInitialState : function() {
    return {
      'dataTable': {},
      'histinput':'investigation_type_summary',
      'generalinfo_histinput':'library_source_summary',
      'seqinfo_histinput': 'library_strategy_summary',
      'areainput':'library_reads_sequenced_summary',
      'seqinfo_areainput':'avg_read_length_summary',
      'radarinput':'library_source_summary',
      'generalinfo_radarinput': 'investigation_type_summary',
      'wordinput':'env_biome_summary'
    }
  },

  handleHistSelect : function(event,index,value) {
    this.setState({"histinput":value});
  },

  handleGeneralHistSelect : function(event,index,value) {
    this.setState({"generalinfo_histinput":value});
  },

  handleSeqHistSelect : function(event, index, value) {
    this.setState({"seqinfo_histinput":value});
  },

  handleAreaSelect : function(event,index,value) {
    this.setState({"areainput":value});
  },

  handleSeqAreaSelect : function(event, index, value) {
    this.setState({"seqinfo_areainput":value});
  },

  handleRadarSelect : function(event,index,value) {
    this.setState({"radarinput":value});
  },

  handleGeneralRadarSelect : function(event,index,value) {
    this.setState({"generalinfo_radarinput":value});
  },

  handleWordSelect : function(event,index,value) {
    this.setState({"wordinput":value});
  },

  render : function () {
    const radarfields = ['study_type_summary','library_source_summary','investigation_type_summary','env_package_summary'];
    const generalinfo_radarfields = ['library_source_summary','investigation_type_summary'];
    const wordfields = ['env_biome_summary','env_feature_summary','env_material_summary','geo_loc_name_summary'];
    const areafields = ['avg_read_length_summary', 'download_size_summary', 'latitude_summary', 'longitude_summary', 'library_reads_sequenced_summary', 'total_bases_summary'];
    const histfields = ['sequencing_method_summary', 'instrument_model_summary', 'library_strategy_summary', 'library_screening_strategy_summary', 'library_construction_method_summary', 'investigation_type_summary', 'env_package_summary', 'library_source_summary', 'study_type_summary'];
    const generalinfo_histfields = ['library_source_summary','investigation_type_summary', 'env_package_summary', 'study_type_summary'];
    const seqinfo_histfields = ['library_strategy_summary', 'library_screening_strategy_summary', 'sequencing_method_summary', 'instrument_model_summary'];
    const seqinfo_areafields = ['avg_read_length_summary', 'library_reads_sequenced_summary', 'total_bases_summary'];

    const geninfo_histcomponent =
        <div>
          <div className="figure-hint-container">
            <span className="figure-hint-label">General Sample Info</span>
            <IconButton tooltip=<div className="figure-hint-tooltip">Count of datasets for each controlled vocabulary value for some General Sample Info fields. Use the select field to change the input value</div> iconStyle={{color:"rgb(180,180,180)", height:"15px"}} style={{height:"18px", padding:"0", marginTop:"2px"}} >
              <ActionHelpOutline />
            </IconButton>
            <br/>
          </div>
          <div className="explore-select">
            <SelectField value={this.state.generalinfo_histinput} onChange={this.handleGeneralHistSelect}>
              {Object.keys(this.props.activeSummaryData).filter(function(value) {
                if (value.indexOf('summary') !== -1 && generalinfo_histfields.includes(value)) {
                  return true;
                } else {
                  return false;
                }
              }).map(function(value, index) {
                  return (
                    <MenuItem key={index} value={value} primaryText={value} />
                  )
              })}
            </SelectField>
          </div>
          <HistogramVictory activeSummaryData={this.props.activeSummaryData} histinput={this.state.generalinfo_histinput} colortheme={VictoryTheme.metaseek} width={530} height={320}/>
        </div>;

    const geninfo_radarcomponent =
      <div>
        <div className="figure-hint-container">
          <span className="figure-hint-label">General Sample Info</span>
          <IconButton tooltip=<div className="figure-hint-tooltip">Count of datasets for each controlled vocabulary value for some General Sample Info fields. Use the select field to change the input value</div> iconStyle={{color:"rgb(180,180,180)", height:"15px"}} style={{height:"18px", padding:"0", marginTop:"2px"}} >
            <ActionHelpOutline />
          </IconButton>
          <br/>
        </div>
        <div className="explore-select">
          <SelectField value={this.state.generalinfo_radarinput} onChange={this.handleGeneralRadarSelect}>
            {Object.keys(this.props.activeSummaryData).filter(function(value) {
              if (value.indexOf('summary') !== -1 && generalinfo_radarfields.includes(value)) {
                return true;
              } else {
                return false;
              }
            }).map(function(value, index) {
              return (
                <MenuItem key={index} value={value} primaryText={value} />
              )
            })}
          </SelectField>
        </div>
        <RadarChart activeSummaryData={this.props.activeSummaryData} radarinput={this.state.generalinfo_radarinput} colortheme={VictoryTheme.metaseek} height={160} width={220}/>
      </div>;

    const libconst_component =
      <div>
        <div className="figure-hint-container">
          <span className="figure-hint-label">Library Construction Method Summary</span>
          <IconButton tooltip=<div className="figure-hint-tooltip">Library construction method used for clone libraries.</div> iconStyle={{color:"rgb(180,180,180)", height:"15px"}} style={{height:"18px", padding:"0", marginTop:"2px"}} >
            <ActionHelpOutline />
          </IconButton>
          <br/>
        </div>
        <PieVictory activeSummaryData={this.props.activeSummaryData} pieinput="library_construction_method_summary" colortheme={VictoryTheme.metaseek}/>
      </div>;

    const seqinfo_histcomponent =
      <div>
        <div className="figure-hint-container">
          <span className="figure-hint-label">Sequencing Info</span>
          <IconButton tooltip=<div className="figure-hint-tooltip">Count of datasets for each controlled vocabulary value for some Sequencing Info fields. Use the select field to change the input value.</div> iconStyle={{color:"rgb(180,180,180)", height:"15px"}} style={{height:"18px", padding:"0", marginTop:"2px"}} >
            <ActionHelpOutline />
          </IconButton>
          <br/>
        </div>
        <div className="explore-select">
          <SelectField value={this.state.seqinfo_histinput} onChange={this.handleSeqHistSelect}>
            {Object.keys(this.props.activeSummaryData).filter(function(value) {
              if (value.indexOf('summary') !== -1 && seqinfo_histfields.includes(value)) {
                return true;
              } else {
                return false;
              }
            }).map(function(value, index) {
                return (
                  <MenuItem key={index} value={value} primaryText={value} />
                )
            })}
          </SelectField>
        </div>
        <HistogramVictory activeSummaryData={this.props.activeSummaryData} histinput={this.state.seqinfo_histinput} colortheme={VictoryTheme.metaseek} width={714} height={320}/>
      </div>;

    const map_component =
      <div>
        <div>
          <div className="figure-hint-container-map">
            <span className="figure-hint-label">Environmental Info</span>
            <IconButton tooltip=<div className="figure-hint-tooltip">Count of datasets within latitude and longitude bins. There are 36 longitude bins and 18 latitude bins within the range specified by your filters. Scroll or double click to zoom in on the map. To see higher resolution bins, edit lon/lat filters in the filter bar to the side.</div> iconStyle={{color:"rgb(180,180,180)", height:"15px"}} style={{height:"18px", padding:"0", marginTop:"2px"}} >
              <ActionHelpOutline />
            </IconButton>
            <br/>
          </div>
          <MapDeckGL className="explore-map-render" mapdata={this.props.activeSummaryData.latlon_map}/>
          <MapLegend fills={this.props.activeSummaryData.map_legend_info.fills} ranges={this.props.activeSummaryData.map_legend_info.ranges}/>
        </div>
      </div>;

    const seqinfo_areacomponent =
      <div>
        <div className="figure-hint-container">
          <span className="figure-hint-label">Sequencing Info</span>
          <IconButton tooltip=<div className="figure-hint-tooltip">Count of datasets for each controlled vocabulary value for some Sequencing Info fields. Use the select field to change the input value.</div> iconStyle={{color:"rgb(180,180,180)", height:"15px"}} style={{height:"18px", padding:"0", marginTop:"2px"}} >
            <ActionHelpOutline />
          </IconButton>
          <br/>
        </div>
        <div className="explore-select">
          <SelectField value={this.state.seqinfo_areainput} onChange={this.handleSeqAreaSelect}>
            {Object.keys(this.props.activeSummaryData).filter(function(value) {
              if (value.indexOf('summary') !== -1 && seqinfo_areafields.includes(value)) {
                return true;
              } else {
                return false;
              }
            }).map(function(value, index) {
                return (
                  <MenuItem key={index} value={value} primaryText={value} />
                )
            })}
          </SelectField>
        </div>
        <AreaChart activeSummaryData={this.props.activeSummaryData} areainput={this.state.seqinfo_areainput} colortheme={VictoryTheme.metaseek}/>
      </div>;

    const envinfo_wordcloudcomponent =
      <div>
        <div className="figure-hint-container">
          <span className="figure-hint-label">Environmental Info</span>
          <IconButton tooltip=<div className="figure-hint-tooltip">Count of datasets for environmental metadata from the ENVO ontology. Use the select field to change the input value. Scroll to see more fields.</div> iconStyle={{color:"rgb(180,180,180)", height:"15px"}} style={{height:"18px", padding:"0", marginTop:"2px"}} >
            <ActionHelpOutline />
          </IconButton>
          <br/>
        </div>
        <div className="explore-select">
          <SelectField value={this.state.wordinput} onChange={this.handleWordSelect}>
            {Object.keys(this.props.activeSummaryData).filter(function(value) {
              if (value.indexOf('summary') !== -1 && wordfields.includes(value)) {
                return true;
              } else {
                return false;
              }
            }).map(function(value, index) {
              return (
                <MenuItem key={index} value={value} primaryText={value} />
              )
            })}
          </SelectField>
        </div>
        <WordCloud activeSummaryData={this.props.activeSummaryData} wordinput={this.state.wordinput}/>
      </div>;

    var renderFigure = function(activeSummaryData,isProcessing,component) {
      if (!isProcessing) {
        if (activeSummaryData.empty) {
          return <h3>Sorry, no matches!</h3>
        } else {
          return component
        }
      } else {
        return <div>
          <div>
            <div className='uil-rolling-css component-loader'>
              <div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
          <h3>Processing...</h3>
        </div>
      }
    };

    return (
      <div className="explore-child-grid">
        <Paper className="explore-histogram">
          {renderFigure(this.props.activeSummaryData,this.props.processing, geninfo_histcomponent)}
        </Paper>
        <Paper className="explore-areachart">
          {renderFigure(this.props.activeSummaryData,this.props.processing, seqinfo_areacomponent)}
        </Paper>
        <Paper className="explore-histogram">
          {renderFigure(this.props.activeSummaryData,this.props.processing, libconst_component)}
        </Paper>
        <Paper className="explore-histogram">
          {renderFigure(this.props.activeSummaryData,this.props.processing, seqinfo_histcomponent)}
        </Paper>
        <Paper className="explore-map">
          {renderFigure(this.props.activeSummaryData,this.props.processing, map_component)}
        </Paper>
        <Paper className="explore-wordcloud">
          {renderFigure(this.props.activeSummaryData,this.props.processing, envinfo_wordcloudcomponent)}
        </Paper>
      </div>
    )
  }
});

export default VizDashboard;
