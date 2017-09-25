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

  renderTable : function(category, datasets) {
    return (
      <Table fixedHeader={false} fixedFooter={false} style={{'tableLayout':'auto'}}>
        <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false} preScanRows={false}>
          {Object.keys(category).map(function(row, index){
            if (datasets[row]) {
              return (
                <TableRow selectable={false} key={index}>
                  <TableRowColumn style={{width:'20%'}}>{category[row]}</TableRowColumn>
                  <TableRowColumn style={{whiteSpace:'normal'}}>{datasets[row]}</TableRowColumn>
                </TableRow>
              )
            }
          })}
        </TableBody>
      </Table>
    )
  },

  renderGenomic : function(category, datasets) {
    var is_genomic = Object.keys(category).map(function(row, index) {
      if (datasets[row]) {
        return true
      } else {
        return false
      }
    }).includes(true);
    if (is_genomic) {
      return(
        <div>
          <h3>Genomic Info</h3>
          {this.renderTable(category, datasets)}
        </div>
      )
    }
  },

  renderEnv : function(category, datasets) {
    const included_env = Object.keys(datasets).filter(function(el) {
      if (datasets[el]) {
        return Object.keys(category).includes(el)
      }});

    const sample_attr = datasets["sample_attributes"] ? JSON.parse(datasets["sample_attributes"]) : {};

    const sample_attr_fields = Object.keys(sample_attr).filter(function(el, index) {
      if (!included_env.includes(el)) {
        return el
      }});

    console.log(included_env)
    console.log(sample_attr)
    console.log(sample_attr_fields)

    return (
      <div>
        <Table fixedHeader={false} fixedFooter={false} style={{'tableLayout':'auto'}}>
          <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false} preScanRows={false}>
            {Object.keys(category).map(function(row, index){
              if (datasets[row]) {
                return (
                  <TableRow selectable={false} key={index}>
                    <TableRowColumn style={{width:'20%'}}>{category[row]}</TableRowColumn>
                    <TableRowColumn style={{whiteSpace:'normal'}}>{datasets[row]}</TableRowColumn>
                  </TableRow>
                )
              }
            })}
          </TableBody>
        </Table>
        <h4 style={{fontWeight:"700"}}>Submitter-Defined Sample Attributes</h4>
        <Table fixedHeader={false} fixedFooter={false} style={{'tableLayout':'auto'}}>
          <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false} preScanRows={false}>
              {sample_attr_fields.map(function(row, index) {
                return(
                  <TableRow selectable={false} key={index}>
                    <TableRowColumn style={{width:'20%'}}>{row}</TableRowColumn>
                    <TableRowColumn style={{whiteSpace:'normal'}}> {sample_attr[row]} </TableRowColumn>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>
    )

  },

  render : function() {
    const header_titles = {'study_title':'Study Title', 'project_name':'Project Name', 'sample_title':'Sample Title', 'expt_title':'Experiment Title', 'sample_description':'Sample Description'};
    const identifier_fields = {'id':'MetaSeek ID', 'db_source':'Database source', 'db_source_uid':'UID from the source database', 'study_id':'Study ID', 'bioproject_id':'BioProject ID', 'sample_id':'Sample ID', 'biosample_id':'BioSample ID', 'biosample_uid':'BioSample UID', 'expt_id':'Experiment ID', 'submission_id':'Submission ID', };
    //all the ids;
    const general_fields = {'investigation_type':'Investigation Type', 'metadata_publication_date':'Metadata Publication Date on Source Database','date_scraped':'Date Added to MetaSeek'};
    const submission_info = {'organization_name':'Submitting Organization Name', 'organization_address':'Submitting Organization Address', 'organization_contacts':'Submitting Organization Contact'}; //organization, submitter, submission id, etc
    const study_fields = {'study_title':'Study Title', 'study_type':'Study Type', 'study_type_other':'Study Type (Other)', 'study_abstract':'Study Abstract', 'study_links':'Links Associated with This Study', 'study_attributes':'Study Attributes'}; //study title, abstract, bioproject, etc
    const seq_fields = {'expt_link':'Link to Experiment', 'expt_design_description':'Experiment Design Description', 'sequencing_method':'Sequencing Method', 'instrument_model':'Instrument Model', 'library_name':'Library Name', 'library_strategy':'Library Strategy', 'library_source':'Library Source', 'library_screening_strategy':'Library Screening Strategy', 'library_construction_method':'Library Construction Method', 'library_construction_protocol':'Library Construction Protocol', 'num_runs_in_accession':'Number of Runs for this Dataset', 'target_gene':'Target Gene Sequenced', 'target_subfragment':'Target Gene Subfragment'};
     //expt id, expt design, library info, run info; join on Run
    const envcontext_fields = {'env_package':'Environmental Package', 'sample_description':'Sample Description', 'biosample_link':'BioSample Link', 'biosample_package':'BioSample Package', 'biosample_models':'BioSample Model/s', 'lat_lon':'Lat_Lon', 'latitude':'Latitude', 'longitude':'Longitude', 'meta_latitude':'Latitude (MetaSeek-inferred)', 'meta_longitude':'Longitude (MetaSeek-inferred)', 'geo_loc_name':'Geographic Location', 'collection_date':'Sample Collection Date', 'collection_time':'Sample Collection Time', 'env_biome':'Environmental Biome', 'env_feature':'Environmental Feature', 'env_material':'Environmental Material', 'depth':'Depth', 'elevation':'Elevation', 'altitude':'Altitude', 'experimental_factor':'Experimental Factor', 'specific_host':'Host Species (Specific Host)', 'tissue':'Tissue', 'sex':'Sex', 'age':'Age', 'dev_stage':'Developmental Stage', 'sample_type':'Sample Type', 'host_disease':'Host Disease'};
    //sample title, sample id and biosample id?,
    const genome_fields = {'ncbi_taxon_id':'NCBI Taxon ID', 'taxon_scientific_name':'Scientific Taxon Name', 'taxon_common_name':'Common Taxon Name', 'subspecific_genetic_lineage':'Subspecific Genetic Lineage (Strain, Genotype, Cultivar, Ecotype, Breed, etc.)', 'ploidy':'Ploidy', 'num_replicons':'Number of Replicons', 'estimated_size':'Estimated Genome Size', 'ref_biomaterial':'Reference for Biomaterial', 'propagation':'Propagation', 'assembly':'Assembly', 'finishing_strategy':'Finishing Strategy', 'isol_growth_condt':'Isolation Growth Conditions', 'biomaterial_provider':'Biomaterial Provider'}
    const publications = {};


    /*
     TODO: return dataset details with all the run info
      run_ids_maxrun = db.Column(db.String(30))
      library_reads_sequenced_maxrun = db.Column(db.BIGINT,index=True)
      total_num_bases_maxrun = db.Column(db.BIGINT,index=True)
      download_size_maxrun = db.Column(db.BIGINT,index=True)
      avg_read_length_maxrun = db.Column(db.Float,index=True)
      baseA_count_maxrun = db.Column(db.BIGINT)
      baseC_count_maxrun = db.Column(db.BIGINT)
      baseG_count_maxrun = db.Column(db.BIGINT)
      baseT_count_maxrun = db.Column(db.BIGINT)
      baseN_count_maxrun = db.Column(db.BIGINT)
      gc_percent_maxrun = db.Column(db.Float,index=True)
      run_quality_counts_maxrun = db.Column(db.Text)

      */
    return (
        <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
          <div>
            <Header history={this.props.history}/>
            <Paper className="dataset-sheet" zDepth={2}>
              <h2>Dataset Detail</h2>
              {this.renderTable(header_titles, this.state.dataset)}
              <h3>Identifiers</h3>
              {this.renderTable(identifier_fields, this.state.dataset)}
              <h3>General</h3>
              {this.renderTable(general_fields, this.state.dataset)}
              <h3>Submission</h3>
              {this.renderTable(submission_info, this.state.dataset)}
              <h3>Study</h3>
              {this.renderTable(study_fields, this.state.dataset)}
              <h3>Sequencing</h3>
              {this.renderTable(seq_fields, this.state.dataset)}
              <h3>Environment/Context</h3>
              {this.renderEnv(envcontext_fields, this.state.dataset)}

              {this.renderGenomic(genome_fields, this.state.dataset)}

            </Paper>
          </div>
        </MuiThemeProvider>
    )
  }
});

export default DatasetDetail;
