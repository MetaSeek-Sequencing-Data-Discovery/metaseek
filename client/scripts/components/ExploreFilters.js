import React from 'react';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Select from 'react-select';
import Collapsible from 'react-collapsible';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import RangeSlider from './RangeSlider';
import ManualRangeSlider from './ManualRangeSlider';
import ChipInput from 'material-ui-chip-input';
import IconButton from 'material-ui/IconButton';
import ActionHelpOutline from 'material-ui/svg-icons/action/help-outline';

var ExploreFilters = React.createClass({
  getInitialState : function() {
    return {
      "filterStates": {
        "investigation_type":{
          "value":"All"
        },
        "env_package":{
          "value":"All"
        },
        "library_source":{
          "value":"All"
        },
        "study_type":{
          "value":"All"
        },
        "latitudeMin":{
          "value":-90
        },
        "latitudeMax":{
          "value":90
        },
        "longitudeMin":{
          "value":-180
        },
        "longitudeMax":{
          "value":180
        },
        "library_strategy":[],
        "library_screening_strategy":[],
        "library_construction_method":{
          "value":"All"
        },
        "sequencing_method":[],
        "instrument_model":[],
        "libRdsSqdMin":{
          "value":"0"
        },
        "libRdsSqdMax":{
          "value":">1e9"
        },
        "totBasesMin":{
          "value":0
        },
        "totBasesMax":{
          "value":1000000000000
        },
        "avgRdLgthMin":{
          "value":"0"
        },
        "avgRdLgthMax":{
          "value":">1000"
        },
        "gcPercentMin":{
          "value":0
        },
        "gcPercentMax":{
          "value":1
        },
        "env_biome":{
          "value":[]
        },
        "env_feature":{
          "value":[]
        },
        "env_material":{
          "value":[]
        },
        "geo_loc_name":{
          "value":[]
        }
    },
    "multSelectStates" :{
      "library_strategy":'',
      "library_screening_strategy":'',
      "sequencing_method":'',
      "instrument_model":''
    },
    "chipStates" :{
      "env_biome":[],
      "env_feature":[],
      "env_material":[],
      "geo_loc_name":[]
    },
    "rangeStates" : {
      "libRdsSqdMin":{
        "value":0
      },
      "libRdsSqdMax":{
        "value":10
      },
      "avgRdLgthMin":{
        "value":0
      },
      "avgRdLgthMax":{
        "value":11
      },
      "latitudeMin":{
        "value":-90
      },
      "latitudeMax":{
        "value":90
      },
      "longitudeMin":{
        "value":-180
      },
      "longitudeMax":{
        "value":180
      },
    }
  }
},

  resetFilters : function(event,index,value) {
    this.state = this.getInitialState();
    this.setState(this.state);
    this.props.updateFilterParams(this.state.filterStates);
  },

  handleFilterChange : function(filterName, field, filterType, event, index, value) {
    var newRule = {
      "field":field,
      "type":filterType,
      "value":value
    };
    this.state.filterStates[filterName] = newRule;
    this.setState(this.state);
    this.props.updateFilterParams(this.state.filterStates);
  },

  handleNumericFilterChange : function(filterName, field, filterType, extreme, event, index, value) {
    //this will only add filter to filterStates if is not the min or max value (for e.g. )
    if (value==extreme) {
      this.state.filterStates[filterName] = {value: extreme};
      this.setState(this.state);
      this.props.updateFilterParams(this.state.filterStates);
    } else {
      var newRule = {
        "field":field,
        "type":filterType,
        "value":value
      };
      this.state.filterStates[filterName] = newRule;
      this.setState(this.state);
      this.props.updateFilterParams(this.state.filterStates);
    }
  },

  handleMultipleFilterChange : function(filterName, field, filterType, values) {
    //get string to array list
    const newValue = this.state.multSelectStates[filterName].split(',')
    //if length is zero
    var newRule = {
      "field":field,
      "type":filterType,
      "value":newValue
    };
    this.state.filterStates[filterName] = newRule;
    this.setState(this.state);
    this.props.updateFilterParams(this.state.filterStates);
  },

  handleMultSelectChange : function(filterName, value) {
    this.state.multSelectStates[filterName] = value
    this.setState(this.state);
  },

  handleChipChange : function(filterName, value) {
    this.state.chipStates[filterName] = value;
    this.setState(this.state);
  },

  handleChipBlur : function(filterName, field, filterType, value, event) {
    var newRule = {
      "field":field,
      "type":filterType,
      "value":event
    };
    this.state.filterStates[filterName] = newRule;
    this.setState(this.state);
    this.props.updateFilterParams(this.state.filterStates);
  },
  renderMenuItem : function(value, index) {
    return (
      <MenuItem key={index} value={value} primaryText={value} />
    )
  },
  getMultOptions : function(summarydata) {
    var search = [{ value: 'search', label: 'Type to search items...', disabled:{true} }]
    var objects = Object.keys(summarydata).map(function(key,index) {return({value:key, label:key}) });
    return (
      search.concat(objects)
    )
  },
  updateRangeValues : function(filterMin, filterMax, minValue, maxValue) {
    this.state.rangeStates[filterMin] = {value: minValue};
    this.state.rangeStates[filterMax] = {value: maxValue};
    this.setState(this.state);
  },

  render : function() {
    /* define multiple select options */
    const libstrat_options = this.getMultOptions(this.props.activeSummaryData.library_strategy_summary);
    const libscreenstrat_options = this.getMultOptions(this.props.activeSummaryData.library_screening_strategy_summary);
    const seqmeth_options = this.getMultOptions(this.props.activeSummaryData.sequencing_method_summary);
    const instmod_options = this.getMultOptions(this.props.activeSummaryData.instrument_model_summary);

    const tooltipStyle = {
      fontFamily: "Roboto",
      fontSize: 12,
      transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
      padding:6,
      width: 220,
      whiteSpace: 'normal',
      textAlign: 'left',
      color: '#3c3c3c',
      background: '#FFF',
      borderColor: "#334A88",
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 2,
      boxShadow: "rgba(60, 60, 60, 0.12) 0px 1px 6px, rgba(60, 60, 60, 0.12) 0px 1px 4px"
    };
    const tooltipIconStyle = {color:"#16825c", height:"16px", marginTop:"8px"};
    const iconLinkStyle = {height:32,width:32, padding:"12px 0 0 12px", zIndex: 100};

    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
            <div>
            {/* Ok, so...let's explain this change handler:
              onChange={this.handleFilterChange.bind(this,"library_source","library_source",5)}
              Javascript functions called in an event handler like this are often
              called with the simpler onChange={this.handleFilterChange}
              This will call the function with the standard arguments and scope
              using bind allows us to call it in the same scope (by saying ".bind(this")
              but then pass in additional arguments indicating the field and the filter type:
              "library_source","library_source",5
              These arguments are passed in first, prior to the standard function params.
               */}
            <FlatButton label="Reset Filters" primary={true} onClick={this.resetFilters}/>
            <Collapsible trigger="General Sample Info" open={true} className="collapsible-container" >
              <div className="filter-field-wrapper">
                <h4 className="filter-field-with-help">Investigation Type</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>The root element of all MIxS-compliant reports. This is a controlled vocabulary.</div> tooltipPosition="bottom-left" href="/glossary#investigation_type" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                  <ActionHelpOutline />
                </IconButton>
                </div>
                <SelectField className="filter-dropdown" value={this.state.filterStates.investigation_type.value} onChange={this.handleFilterChange.bind(this,"investigation_type","investigation_type",5)}>
                  <MenuItem value={"All"} primaryText="All" />
                  {Object.keys(this.props.fullSummaryData.investigation_type_summary)
                    .map(this.renderMenuItem)}
                  </SelectField>
              </div>

              <div className="filter-field-wrapper">
                <h4 className="filter-field-with-help">Environmental Package</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>Environment from which the sample was obtained.</div> tooltipPosition="top-left" href="/glossary#env_package" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
                <SelectField className="filter-dropdown" value={this.state.filterStates.env_package.value} onChange={this.handleFilterChange.bind(this,"env_package","env_package",5)}>
                  <MenuItem value={"All"} primaryText="All" />
                  {Object.keys(this.props.fullSummaryData.env_package_summary)
                    .map(this.renderMenuItem)}
                  </SelectField>
              </div>

              <div className="filter-field-wrapper">
                <h4 className="filter-field-with-help">Library Source</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>The type of source material that is being sequenced.</div> tooltipPosition="top-left" href="/glossary#library_source" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
                <SelectField className="filter-dropdown" value={this.state.filterStates.library_source.value} onChange={this.handleFilterChange.bind(this,"library_source","library_source",5)}>
                  <MenuItem value={"All"} primaryText="All" />
                  {Object.keys(this.props.fullSummaryData.library_source_summary)
                    .map(this.renderMenuItem)}
                  </SelectField>
              </div>

              <div className="filter-field-wrapper">
                <h4 className="filter-field-with-help">Study Type</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>SRA controlled vocabulary for type of study.</div> tooltipPosition="top-left" href="/glossary#study_type" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
                <SelectField className="filter-dropdown" value={this.state.filterStates.study_type.value} onChange={this.handleFilterChange.bind(this,"study_type","study_type",5)}>
                  <MenuItem value={"All"} primaryText="All" />
                  {Object.keys(this.props.fullSummaryData.study_type_summary)
                    .map(this.renderMenuItem)}
                  </SelectField>
              </div>
            </Collapsible>

            <Collapsible trigger="Sequencing Info" open={false}>
              <div>
                <h4 className="filter-field-with-help">Library Strategy</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>Sequencing technique used for this library.</div> tooltipPosition="bottom-left" href="/glossary#library_strategy" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
              </div>
              <Select name="library_strategy" placeholder="Select Sequencing Strategie(s)" multi={true} simpleValue={true} value={this.state.multSelectStates.library_strategy}  options={libstrat_options} onChange={this.handleMultSelectChange.bind(this,"library_strategy")} onClose={this.handleMultipleFilterChange.bind(this,"library_strategy", "library_strategy", 8, this.state.multSelectStates.library_strategy)} closeOnSelect={false}/>

              <div>
                <h4 className="filter-field-with-help">Library Screening Strategy</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>Whether any method was used to select for or against, enrich, or screen the material being sequenced.</div> tooltipPosition="top-left" href="/glossary#library_screening_strategy" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
              </div>
              <Select name="library_screening_strategy" placeholder="Select Screening Strategie(s)" multi={true} simpleValue={true} value={this.state.multSelectStates.library_screening_strategy}  options={libscreenstrat_options} onChange={this.handleMultSelectChange.bind(this,"library_screening_strategy")} onClose={this.handleMultipleFilterChange.bind(this,"library_screening_strategy", "library_screening_strategy", 8, this.state.multSelectStates.library_screening_strategy)} closeOnSelect={false}/>

              <div className="filter-field-wrapper">
                <h4 className="filter-field-with-help">Library Construction Method</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>Whether to expect single or paired-end reads.</div> tooltipPosition="top-left" href="/glossary#library_construction_method" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
                <SelectField className="filter-dropdown" value={this.state.filterStates.library_construction_method.value} onChange={this.handleFilterChange.bind(this,"library_construction_method","library_construction_method",5)}>
                  <MenuItem value={"All"} primaryText="All" />
                  {Object.keys(this.props.activeSummaryData.library_construction_method_summary)
                    .map(this.renderMenuItem)}
                  </SelectField>
              </div>

              <div className="filter-field-wrapper">
                <h4 className="filter-field-with-help">Sequencing Method</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>Sequencing platform used for sequencing. This is a controlled vocabulary.</div> tooltipPosition="top-left" href="/glossary#sequencing_method" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
              </div>
              <Select name="sequencing_method" placeholder="Select Sequencing Method(s)" multi={true} simpleValue={true} value={this.state.multSelectStates.sequencing_method}  options={seqmeth_options} onChange={this.handleMultSelectChange.bind(this,"sequencing_method")} onClose={this.handleMultipleFilterChange.bind(this,"sequencing_method", "sequencing_method", 8, this.state.multSelectStates.sequencing_method)} closeOnSelect={false}/>

              <div>
                <h4 className="filter-field-with-help">Instrument Model</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>Model of instrument used for sequencing.</div> tooltipPosition="top-left" href="/glossary#instrument_model" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
              </div>
              <Select name="instrument_model" placeholder="Select Instrument Model(s)" multi={true} simpleValue={true} value={this.state.multSelectStates.instrument_model}  options={instmod_options} onChange={this.handleMultSelectChange.bind(this,"instrument_model")} onClose={this.handleMultipleFilterChange.bind(this,"instrument_model", "instrument_model", 8, this.state.multSelectStates.instrument_model)} closeOnSelect={false}/>

              <div>
                <h4 className="filter-field-with-help">Average Read Length</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>Average number of nucleotides per sequencing read.</div> tooltipPosition="top-left" href="/glossary#avg_read_length" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
              </div>
              <ManualRangeSlider field="avg_read_length_maxrun" filterMin="avgRdLgthMin" filterMax="avgRdLgthMax"
                filterTypeMin={4} filterTypeMax={3} min={0} max={11}
                minValue={this.state.rangeStates.avgRdLgthMin.value} maxValue={this.state.rangeStates.avgRdLgthMax.value}
                handleNumericFilterChange={this.handleNumericFilterChange} updateRangeValues={this.updateRangeValues}
                marks={{0:"0", 1:"100", 2:"200", 3:"300", 4:"400", 5:"500", 6:"600", 7:"700", 8:"800", 9:"900", 10:"1000", 11:">1000"}}
              />
              <div>
                <h4 className="filter-field-with-help">Number of Reads Sequenced</h4>
                <div className="gloss-icon-wrapper">
                    <IconButton tooltip=<div style={tooltipStyle}>Total number of reads sequenced.</div> tooltipPosition="top-left" href="/glossary#library_reads_sequenced" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                      <ActionHelpOutline />
                    </IconButton>
                </div>
              </div>
              <ManualRangeSlider field="library_reads_sequenced_maxrun" filterMin="libRdsSqdMin" filterMax="libRdsSqdMax"
                filterTypeMin={4} filterTypeMax={3} min={0} max={10}
                minValue={this.state.rangeStates.libRdsSqdMin.value} maxValue={this.state.rangeStates.libRdsSqdMax.value}
                handleNumericFilterChange={this.handleNumericFilterChange} updateRangeValues={this.updateRangeValues}
                marks={{0:"0", 1:"10", 2:"1e2", 3:"1e3", 4:"1e4", 5:"1e5", 6:"1e6", 7:"1e7", 8:"1e8", 9:"1e9", 10:">1e9"}}
              />
            </Collapsible>

            <Collapsible trigger="Environmental/Contextual Info" open={false}>
              <h4>Latitude</h4>
              <RangeSlider field="meta_latitude" filterMin="latitudeMin" filterMax="latitudeMax"
                filterTypeMin={4} filterTypeMax={3} min={-90} max={90}
                minValue={this.state.rangeStates.latitudeMin.value} maxValue={this.state.rangeStates.latitudeMax.value}
                handleNumericFilterChange={this.handleNumericFilterChange} updateRangeValues={this.updateRangeValues}
              />
              <h4>Longitude</h4>
              <RangeSlider field="meta_longitude" filterMin="longitudeMin" filterMax="longitudeMax"
                filterTypeMin={4} filterTypeMax={3} min={-180} max={180}
                minValue={this.state.rangeStates.longitudeMin.value} maxValue={this.state.rangeStates.longitudeMax.value}
                handleNumericFilterChange={this.handleNumericFilterChange} updateRangeValues={this.updateRangeValues}
              />
              <div className="filter-field-wrapper">>
                <h4 className="filter-field-with-help">Environmental Biome</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>The broad ecological context of a sample. From the EnvO ontology.</div> tooltipPosition="top-left" href="/glossary#env_biome" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
                <ChipInput
                  className="chip-input-field"
                  hintText={"Press enter to create tags, and find datasets that contain any tag's text."}
                  hintStyle={{"color":"#B3B3B3"}}
                  onChange={this.handleChipBlur.bind(this,"env_biome","env_biome",7,this.state.chipStates.env_biome)}
                />
              </div>
              <div className="filter-field-wrapper">
                <h4 className="filter-field-with-help">Environmental Feature</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>A descriptor of the more local environment. From the EnvO ontology.</div> tooltipPosition="top-left" href="/glossary#env_feature" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
                <ChipInput className="chip-input-field"
                  onChange={this.handleChipBlur.bind(this,"env_feature","env_feature",7,this.state.chipStates.env_feature)}
                />
              </div>
              <div className="filter-field-wrapper">
                <h4 className="filter-field-with-help">Environmental Material</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>The material in which a sample was embedded prior to the sampling event. From the EnvO ontology.</div> tooltipPosition="top-left" href="/glossary#env_material" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
                <ChipInput className="chip-input-field"
                  onChange={this.handleChipBlur.bind(this,"env_material","env_material",7,this.state.chipStates.env_material)}
                />
              </div>
              <div className="filter-field-wrapper">
                <h4 className="filter-field-with-help">Geographic Location</h4>
                <div className="gloss-icon-wrapper">
                  <IconButton tooltip=<div style={tooltipStyle}>Geographical origin of the sample as defined by the country or sea name followed by specific region name. Ontology field.</div> tooltipPosition="top-left" href="/glossary#geo_loc_name" iconStyle={tooltipIconStyle} style={iconLinkStyle} >
                    <ActionHelpOutline />
                  </IconButton>
                </div>
                <ChipInput className="chip-input-field"
                  onChange={this.handleChipBlur.bind(this,"geo_loc_name","geo_loc_name",7,this.state.chipStates.geo_loc_name)}
                />
              </div>
            </Collapsible>
            </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default ExploreFilters;
