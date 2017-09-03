import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';

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
            <h3 className="glossary-term">Average Read Length</h3>
            <section className="glossary-item" id="avg_read_length">
              {glossary["avg_read_length"]}
            </section>
            <h3 className="glossary-term">Environmental Biome</h3>
            <section className="glossary-item" id="env_biome">
              {glossary["env_biome"]}
            </section>
            <h3 className="glossary-term">Environmental Feature</h3>
            <section className="glossary-item" id="env_feature">
              {glossary["env_feature"]}
            </section>
            <h3 className="glossary-term">Environmental Material</h3>
            <section className="glossary-item" id="env_material">
              {glossary["env_material"]}
            </section>
            <h3 className="glossary-term">Environmental Package</h3>
            <section className="glossary-item" id="env_package">
              {glossary["env_package"]}
            </section>
            <h3 className="glossary-term">Geographic Location</h3>
            <section className="glossary-item" id="geo_loc_name">
              {glossary["geo_loc_name"]}
            </section>
            <h3 className="glossary-term">Instrument Model</h3>
            <section className="glossary-item" id="instrument_model">
              {glossary["instrument_model"]}
            </section>
            <h3 className="glossary-term">Investigation Type</h3>
            <section className="glossary-item" id="investigation_type">
              {glossary["investigation_type"]}
            </section>
            <h3 className="glossary-term">Library Construction Method</h3>
            <section className="glossary-item" id="library_construction_method">
              {glossary["library_construction_method"]}
            </section>
            <h3 className="glossary-term">Library Reads Sequenced (Number of Reads Sequenced)</h3>
            <section className="glossary-item" id="library_reads_sequenced">
              {glossary["library_reads_sequenced"]}
            </section>
            <h3 className="glossary-term">Library Screening Strategy</h3>
            <section className="glossary-item" id="library_screening_strategy">
              {glossary["library_screening_strategy"]}
            </section>
            <h3 className="glossary-term">Library Source</h3>
            <section className="glossary-item" id="library_source">
              {glossary["library_source"]}
            </section>
            <h3 className="glossary-term">Library Strategy</h3>
            <section className="glossary-item" id="library_strategy">
              {glossary["library_strategy"]}
            </section>
            <h3 className="glossary-term">Percent GC</h3>
            <section className="glossary-item" id="percent_gc">
              {glossary["percent_gc"]}
            </section>
            <h3 className="glossary-term">Sequencing Method</h3>
            <section className="glossary-item" id="sequencing_method">
              {glossary["sequencing_method"]}
            </section>
            <h3 className="glossary-term">Study Type</h3>
            <section className="glossary-item" id="study_type">
              {glossary["study_type"]}
            </section>
          </div>
        </Paper>
    </MuiThemeProvider>
    )
  }
});

export default Glossary;
