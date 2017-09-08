import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';
import ScrollableAnchor from 'react-scrollable-anchor';
import { Link } from 'react-router';

var Glossary = React.createClass ({
  getInitialState : function() {
    return {}
  },

  render : function() {

    const glossary = require('../glossary.json');
    //console.log(glossary["investigation_type"]);

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
        <Paper className="glossary-paper">
          <div>
            <h2>Glossary</h2>
            <h3 className="glossary-term">Overview and Useful Links</h3>
            <section className="glossary-item">
              MetaSeek uses the MIxS metadata standards for sequencing samples. The Sequence Read Archive (SRA) makes it possible to submit a MIxS-compliant sample, but doesn't require it. The SRA also has its own set of mandatory fields that are usually very informative but not included in the MIxS standards. The SRA fields are defined in <Link to="https://www.ncbi.nlm.nih.gov/books/NBK54984/" target="_blank">their glossary</Link>. To see the BioSample sample attributes that are required for each type of package, see <Link to="https://submit.ncbi.nlm.nih.gov/biosample/template/" target="_blank">here</Link>. Many of these fields are controlled vocabularies, meaning that the data entry is supposed to be one of a fixed set of values. We find <Link to="http://www.ebi.ac.uk/ena/submit/preparing-xmls" target="_blank">this Preparing SRA submissions guide</Link> useful for a list of SRA controlled vocabulary fields for each metadata field, if it exists. <Link to="http://www.ebi.ac.uk/ena/submit/mixs-checklists#environment_specific" target="_blank">This page</Link> provides a nice summary of the mandatory fields for each type of MIxS-compliant sample. For definitions and controlled vocabulary values for all of the MIxS metadata fields, see <Link to="https://terms.tdwg.org/wiki/MIxS" target="_blank">here</Link>.
            </section>
            <h3 className="glossary-term">Average Read Length</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="avg_read_length">
                {glossary["avg_read_length"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Environmental Biome</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="env_biome">
                {glossary["env_biome"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Environmental Feature</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="env_feature">
                {glossary["env_feature"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Environmental Material</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="env_material">
                {glossary["env_material"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Environmental Package</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="env_package">
                {glossary["env_package"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Geographic Location</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="geo_loc_name">
                {glossary["geo_loc_name"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Instrument Model</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="instrument_model">
                {glossary["instrument_model"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Investigation Type</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="investigation_type">
                {glossary["investigation_type"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Library Construction Method</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="library_construction_method">
                {glossary["library_construction_method"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Library Reads Sequenced (Number of Reads Sequenced)</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="library_reads_sequenced">
                {glossary["library_reads_sequenced"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Library Screening Strategy</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="library_screening_strategy">
                {glossary["library_screening_strategy"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Library Source</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="library_source">
                {glossary["library_source"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Library Strategy</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="library_strategy">
                {glossary["library_strategy"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Percent GC</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="percent_gc">
                {glossary["percent_gc"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Sequencing Method</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="sequencing_method">
                {glossary["sequencing_method"]}
              </section>
            </ScrollableAnchor>
            <h3 className="glossary-term">Study Type</h3>
            <ScrollableAnchor>
              <section className="glossary-item" id="study_type">
                {glossary["study_type"]}
              </section>
            </ScrollableAnchor>
          </div>
        </Paper>
    </MuiThemeProvider>
    )
  }
});

export default Glossary;
