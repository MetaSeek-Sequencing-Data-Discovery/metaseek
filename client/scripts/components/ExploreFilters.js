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

import RangeSlider from './RangeSlider';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import ChipInput from 'material-ui-chip-input';
import IconButton from 'material-ui/IconButton';
import ActionHelpOutline from 'material-ui/svg-icons/action/help-outline';

const Range = Slider.createSliderWithTooltip(Slider.Range);


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
          "value":0
        },
        "libRdsSqdMax":{
          "value":10000000000
        },
        "totBasesMin":{
          "value":0
        },
        "totBasesMax":{
          "value":1000000000000
        },
        "avgRdLgthMin":{
          "value":0
        },
        "avgRdLgthMax":{
          "value":30000
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

/*
  handleMinText : function(event, value) {
    var newRule = {
      "field":"avg_read_length_maxrun",
      "type":4,
      "value":value
    };
    this.state.filterStates["avgRdLgthMin"] = newRule;
    this.setState(this.state);
  },
*/
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


  render : function() {
    /* define multiple select options */
    const libstrat_options = this.getMultOptions(this.props.activeSummaryData.library_strategy_summary);
    const libscreenstrat_options = this.getMultOptions(this.props.activeSummaryData.library_screening_strategy_summary);
    const seqmeth_options = this.getMultOptions(this.props.activeSummaryData.sequencing_method_summary);
    const instmod_options = this.getMultOptions(this.props.activeSummaryData.instrument_model_summary);

    const glossary = require('../glossary.json');
    console.log(glossary["investigation_type"]);

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
               {/*
            <h4>Investigation Type</h4>
            <SelectField multiple={true} value={this.state.filterStates.investigationTypes} onChange={this.handleMultipleFilterChange}>
              {Object.keys(this.props.activeSummaryData.investigation_type_summary)
                     .map(this.renderMultipleMenuItem)}
            </SelectField> */}
            <FlatButton label="Reset Filters" primary={true} onClick={this.resetFilters}/>
            <Collapsible trigger="General Sample Info" open={true}>
              <h4>Investigation Type</h4>
              <div>
                <SelectField value={this.state.filterStates.investigation_type.value} onChange={this.handleFilterChange.bind(this,"investigation_type","investigation_type",5)}>
                  <MenuItem value={"All"} primaryText="All" />
                  {Object.keys(this.props.fullSummaryData.investigation_type_summary)
                         .map(this.renderMenuItem)}
                </SelectField>
                <IconButton tooltip="The root element of all MIGS/MIMS compliant reports as standardized by Genomic Standards Consortium. This is a controlled vocabulary."  href="/glossary#investigation_type" iconStyle={{color:"#FFB3A0", height:"15px", marginTop:"-15px"}} >
                  <ActionHelpOutline />
                </IconButton>

              </div>


              <h4>Environmental Package</h4>
              <div>
                <SelectField value={this.state.filterStates.env_package.value} onChange={this.handleFilterChange.bind(this,"env_package","env_package",5)}>
                  <MenuItem value={"All"} primaryText="All" />
                  {Object.keys(this.props.fullSummaryData.env_package_summary)
                         .map(this.renderMenuItem)}
                </SelectField>
                <IconButton tooltip="Environment from which the sample was obtained."  href="/glossary#env_package" iconStyle={{color:"#FFB3A0", height:"15px", marginTop:"-15px"}} >
                  <ActionHelpOutline />
                </IconButton>
              </div>


              <h4>Library Source</h4>
              <div>
                <SelectField value={this.state.filterStates.library_source.value} onChange={this.handleFilterChange.bind(this,"library_source","library_source",5)}>
                  <MenuItem value={"All"} primaryText="All" />
                  {Object.keys(this.props.fullSummaryData.library_source_summary)
                         .map(this.renderMenuItem)}
                </SelectField>
                <IconButton tooltip="The type of source material that is being sequenced."  href="/glossary#library_source" iconStyle={{color:"#FFB3A0", height:"15px", marginTop:"-15px"}} >
                  <ActionHelpOutline />
                </IconButton>
              </div>


              <h4>Study Type</h4>
              <div>
                <SelectField value={this.state.filterStates.study_type.value} onChange={this.handleFilterChange.bind(this,"study_type","study_type",5)}>
                  <MenuItem value={"All"} primaryText="All" />
                  {Object.keys(this.props.fullSummaryData.study_type_summary)
                         .map(this.renderMenuItem)}
                </SelectField>
                <IconButton tooltip="SRA controlled vocabulary for type of study."  href="/glossary#study_type" iconStyle={{color:"#FFB3A0", height:"15px", marginTop:"-15px"}} >
                  <ActionHelpOutline />
                </IconButton>
              </div>

            </Collapsible>

            <Collapsible trigger="Sequencing Info" open={true}>
              <h4>Library Strategy</h4>
              <div>
                <Select name="library_strategy" placeholder="Select Sequencing Strategie(s)" multi={true} simpleValue={true} value={this.state.multSelectStates.library_strategy}  options={libstrat_options} onChange={this.handleMultSelectChange.bind(this,"library_strategy")} onClose={this.handleMultipleFilterChange.bind(this,"library_strategy", "library_strategy", 8, this.state.multSelectStates.library_strategy)}/>
                  <IconButton tooltip="Sequencing technique intended for this library."  href="/glossary#library_strategy" iconStyle={{color:"#FFB3A0", height:"15px", marginTop:"-15px"}} >
                    <ActionHelpOutline />
                  </IconButton>
              </div>

              <h4>Library Screening Strategy</h4>
              <div>
                <Select name="library_screening_strategy" placeholder="Select Screening Strategie(s)" multi={true} simpleValue={true} value={this.state.multSelectStates.library_screening_strategy}  options={libscreenstrat_options} onChange={this.handleMultSelectChange.bind(this,"library_screening_strategy")} onClose={this.handleMultipleFilterChange.bind(this,"library_screening_strategy", "library_screening_strategy", 8, this.state.multSelectStates.library_screening_strategy)}/>
                  <IconButton tooltip="Whether any method was used to select for or against, enrich, or screen the material being sequenced."  href="/glossary#library_screening_strategy" iconStyle={{color:"#FFB3A0", height:"15px", marginTop:"-15px"}} >
                    <ActionHelpOutline />
                  </IconButton>
              </div>


              <h4>Library Construction Method</h4>
              <SelectField value={this.state.filterStates.library_construction_method.value} onChange={this.handleFilterChange.bind(this,"library_construction_method","library_construction_method",5)}>
                <MenuItem value={"All"} primaryText="All" />
                {Object.keys(this.props.activeSummaryData.library_construction_method_summary)
                       .map(this.renderMenuItem)}
              </SelectField>

              <h4>Sequencing Method</h4>
              <Select name="sequencing_method" placeholder="Select Sequencing Method(s)" multi={true} simpleValue={true} value={this.state.multSelectStates.sequencing_method}  options={seqmeth_options} onChange={this.handleMultSelectChange.bind(this,"sequencing_method")} onClose={this.handleMultipleFilterChange.bind(this,"sequencing_method", "sequencing_method", 8, this.state.multSelectStates.sequencing_method)}/>

              <h4>Instrument Model</h4>
              <Select name="instrument_model" placeholder="Select Instrument Model(s)" multi={true} simpleValue={true} value={this.state.multSelectStates.instrument_model}  options={instmod_options} onChange={this.handleMultSelectChange.bind(this,"instrument_model")} onClose={this.handleMultipleFilterChange.bind(this,"instrument_model", "instrument_model", 8, this.state.multSelectStates.instrument_model)}/>

              <h4>Average Read Length</h4>
              {/*
              <div className='range-slider-with-text-left'>
                <TextField
                   style={{height:'60px'}} inputStyle={{fontSize:'70%'}}
                   floatingLabelText="min"
                   defaultValue={this.state.filterStates.avgRdLgthMin.value}
                   onChange={this.handleMinText}
                 />
              </div>
              <div className='range-slider-with-text-center'>*/}
              <RangeSlider field="avg_read_length_maxrun" filterMin="avgRdLgthMin" filterMax="avgRdLgthMax"
                filterTypeMin={4} filterTypeMax={3} min={0} max={30000}
                minValue={this.state.filterStates.avgRdLgthMin.value} maxValue={this.state.filterStates.avgRdLgthMax.value}
                handleFilterChange={this.handleFilterChange}
                step={this.state.filterStates.avgRdLgthMax.value/100}
              />
              {/* </div>
              <div className='range-slider-with-text-right'>
                <TextField
                   defaultValue={this.state.filterStates.avgRdLgthMax.value}
                   floatingLabelText="max"
                   style={{height:'60px'}} inputStyle={{fontSize:'70%'}}
                 />
              </div> */}

              <h4>Percent GC</h4>
              <RangeSlider field="gc_percent_maxrun" filterMin="gcPercentMin" filterMax="gcPercentMax"
                filterTypeMin={4} filterTypeMax={3} min={0} max={1}
                minValue={this.state.filterStates.gcPercentMin.value} maxValue={this.state.filterStates.gcPercentMax.value}
                handleFilterChange={this.handleFilterChange}
                step={0.01}
              />

            <h4>Number of Reads Sequenced</h4>
              <RangeSlider field="library_reads_sequenced_maxrun" filterMin="libRdsSqdMin" filterMax="libRdsSqdMax"
                filterTypeMin={4} filterTypeMax={3} min={0} max={10000000000}
                minValue={this.state.filterStates.libRdsSqdMin.value} maxValue={this.state.filterStates.libRdsSqdMax.value}
                handleFilterChange={this.handleFilterChange}
                step={this.state.filterStates.libRdsSqdMax.value/1000}
              />
              {/*
                <h4>Library Reads Sequenced</h4>
                <Range marks={{0:'0',1:'100',2:'10^3',3:'10^4',4:'10^5',5:'10^6'}} step={null} allowCross={false} min={0} max={5} defaultValue={[0,5]} onAfterStop={this.handlelog}/>*/}

              {/*}<h4>Total Number of Bases</h4>
              <RangeSlider field="total_num_bases_maxrun" filterMin="totBasesMin" filterMax="totBasesMax"
                filterTypeMin={4} filterTypeMax={3} min={0} max={1000000000000}
                minValue={this.state.filterStates.totBasesMin.value} maxValue={this.state.filterStates.totBasesMax.value}
                handleFilterChange={this.handleFilterChange}
                step={this.state.filterStates.totBasesMax.value/1000000000}
              />*/}
            </Collapsible>

            <Collapsible trigger="Environmental/Contextual Info" open={true}>
              <h4>Latitude</h4>
              <RangeSlider field="meta_latitude" filterMin="latitudeMin" filterMax="latitudeMax"
                filterTypeMin={4} filterTypeMax={3} min={-90} max={90}
                minValue={this.state.filterStates.latitudeMin.value} maxValue={this.state.filterStates.latitudeMax.value}
                handleFilterChange={this.handleFilterChange}
              />
              <h4>Longitude</h4>
              <RangeSlider field="meta_longitude" filterMin="longitudeMin" filterMax="longitudeMax"
                filterTypeMin={4} filterTypeMax={3} min={-180} max={180}
                minValue={this.state.filterStates.longitudeMin.value} maxValue={this.state.filterStates.longitudeMax.value}
                handleFilterChange={this.handleFilterChange}
              />
              <h4>Environmental Biome</h4>
              <ChipInput
                hintText={"Press enter to generate tags. Click outside the box to search MetaSeek"}
                onChange={this.handleChipBlur.bind(this,"env_biome","env_biome",7,this.state.chipStates.env_biome)}
              />
              <h4>Environmental Feature</h4>
              <ChipInput
                onChange={this.handleChipBlur.bind(this,"env_feature","env_feature",7,this.state.chipStates.env_feature)}
              />
              <h4>Environmental Material</h4>
              <ChipInput
                onChange={this.handleChipBlur.bind(this,"env_material","env_material",7,this.state.chipStates.env_material)}
              />
            <h4>Geographic Location</h4>
              <ChipInput
                onChange={this.handleChipBlur.bind(this,"geo_loc_name","geo_loc_name",7,this.state.chipStates.geo_loc_name)}
              />
            {/* Find a better component for this
              <h4>Geographic Location</h4>
              <AutoComplete
                dataSource={["press Enter to search samples with this text in its geo_loc_name"]}
                hintText="Search for geo_loc_name"
                floatingLabelText="Geographic Locations containing:"
              />
              */}
            </Collapsible>


          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default ExploreFilters;
