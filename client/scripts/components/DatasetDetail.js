import React from 'react';
import axios from 'axios';
import apiConfig from '../config/api.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';

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
  renderField : function(field, index) {
    return (
      <ListItem key={index}>{field} - {this.state.dataset[field]}</ListItem>
    )
  },

  render : function() {
    const header_titles = {'study_title':'Study Title', 'sample_title':'Sample Title', 'expt_title':'Experiment Title', 'sample_description':'Sample Description'};
    const identifier_fields = {'id':'MetaSeek ID', 'db_source':'Database source', 'db_source_uid':'UID from the source database', 'study_id':'Study ID', 'bioproject_id':'BioProject ID', 'sample_id':'Sample ID', 'biosample_id':'BioSample ID', 'biosample_uid':'BioSample UID', 'expt_id':'Experiment ID', 'submission_id':'Submission ID', }; //all the ids
    const general_fields = {'metadata_publication_date':'Metadata Publication Date','date_scraped':'Date Added to MetaSeek'}; //all the ids;
    const submission_info = {'organization_name':'Submitting Organization Name', 'organization_address':'Submitting Organization Address', 'organization_contacts':'Submitting Organization Contact'}; //organization, submitter, submission id, etc
    const study_fields = {'study_title':'Study Title', 'study_type':'Study Type', 'study_type_other':'Study Type (Other)', 'study_abstract':'Study Abstract', 'study_links':'Links Associated with This Study', 'study_attributes':'Study Attributes'}; //study title, abstract, bioproject, etc
    const seq_fields = {'expt_link':'Link to Experiment', 'expt_design_description':'Experiment Design Description', 'sequencing_method':'Sequencing Method', 'instrument_model':'Instrument Model', 'library_name':'Library Name', 'library_strategy':'Library Strategy', 'library_source':'Library Source', 'library_screening_strategy':'Library Screening Strategy', 'library_construction_method':'Library Construction Method', 'library_construction_protocol':'Library Construction Protocol', 'num_runs_in_accession':'Number of Runs for this Dataset'};
     //expt id, expt design, library info, run info; join on Run
    const envcontext_fields = {'sample_description':'Sample Description', 'biosample_link':'BioSample Link', 'biosample_package':'BioSample Package', 'biosample_models':'BioSample Model/s', 'ncbi_taxon_id':'NCBI Taxon ID', 'taxon_scientific_name':'Scientific Taxon Name', 'taxon_common_name':'Common Taxon Name'}; //sample title, sample id and biosample id?,
    const publications = {};

    /*
    sample_attributes = db.Column(db.Text)
    investigation_type = db.Column(db.String(80),index=True)
    env_package = db.Column(db.String(100),index=True)
    project_name = db.Column(db.Text)
    lat_lon = db.Column(db.Text)
    latitude = db.Column(db.Text)
    longitude = db.Column(db.Text)
    meta_latitude = db.Column(db.Float,index=True)
    meta_longitude = db.Column(db.Float,index=True)
    geo_loc_name = db.Column(db.String(100),index=True)
    collection_date = db.Column(db.Text)
    collection_time = db.Column(db.Text)
    env_biome = db.Column(db.String(100),index=True)
    env_feature = db.Column(db.String(200),index=True)
    env_material = db.Column(db.String(150),index=True)
    depth = db.Column(db.Text)
    elevation = db.Column(db.Text)
    altitude = db.Column(db.Text)
    target_gene = db.Column(db.Text)
    target_subfragment = db.Column(db.Text)
    ploidy = db.Column(db.Text)
    num_replicons = db.Column(db.Text)
    estimated_size = db.Column(db.Text)
    ref_biomaterial = db.Column(db.Text)
    propagation = db.Column(db.Text)
    assembly = db.Column(db.Text)
    finishing_strategy = db.Column(db.Text)
    isol_growth_condt = db.Column(db.Text)
    experimental_factor = db.Column(db.Text)
    specific_host = db.Column(db.Text)
    subspecific_genetic_lineage = db.Column(db.Text)
    tissue = db.Column(db.Text)
    sex = db.Column(db.Text)
    sample_type = db.Column(db.Text)
    age = db.Column(db.Text)
    dev_stage = db.Column(db.Text)
    biomaterial_provider = db.Column(db.Text)
    host_disease = db.Column(db.Text)
     = db.Column(db.DateTime)

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
            <Paper className="single-sheet" zDepth={2}>
              <h2>Dataset Detail</h2>
                <List>
                  {Object.keys(this.state.dataset).map(this.renderField)}
                </List>
            </Paper>
          </div>
        </MuiThemeProvider>
    )
  }
});

export default DatasetDetail;
